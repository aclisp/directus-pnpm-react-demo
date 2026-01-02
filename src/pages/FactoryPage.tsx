import { useDirectus } from '@/directus'
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import type { DirectusField, DirectusRelation } from '@directus/sdk'
import { readCollections, readFieldsByCollection, readRelations } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Button, Select, Tree } from 'antd'
import { useRef, useState } from 'react'

export function FactoryPage() {
    const [collection, setCollection] = useState<string>()

    return (
        <>
            <SearchCollectionInput value={collection} onChange={setCollection} />
            {collection && <CollectionFields collection={collection} />}
        </>
    )
}

interface TreeNode extends DirectusField {
    /** React key that is unique in the whole tree */
    key: string
    /** `isLeaf` is false means the tree node is expandable */
    isLeaf: boolean
    /** Relation is available when the tree node is expanded */
    relation?: Relation
    /** Whether the node is checked */
    checked: boolean
    /** Whether the node is half-checked */
    halfChecked: boolean
    /** Sub tree nodes */
    children?: TreeNode[]
    /** Parent node */
    parent?: TreeNode
}

interface CheckedKeys {
    checked: string[]
    halfChecked: string[]
}

/**
 * Calculate checked keys from tree data. Use this function for derived state in react component.
 */
function getCheckedKeys(treeData: TreeNode[]): CheckedKeys {
    const checkedKeys: string[] = []
    const halfCheckedKeys: string[] = []

    function traverse(nodes: TreeNode[]) {
        for (const node of nodes) {
            if (node.checked) {
                checkedKeys.push(node.key)
            } else if (node.halfChecked) {
                halfCheckedKeys.push(node.key)
            }

            if (node.children && node.children.length > 0) {
                traverse(node.children)
            }
        }
    }

    traverse(treeData)

    return {
        checked: checkedKeys,
        halfChecked: halfCheckedKeys,
    } satisfies CheckedKeys
}

/**
 * In-place mutate tree data for checked keys.
 */
function setCheckedKeys(
    treeData: TreeNode[],
    checkedData: CheckedKeys,
) {
    const checkedSet = new Set(checkedData.checked)

    /**
     * @returns boolean - True if this node OR any descendant is
     * currently active (checked or halfChecked).
     */
    function traverse(nodes: TreeNode[]): boolean {
        let anyNodeInLevelIsActive = false

        for (const node of nodes) {
            const hasChildren = node.children && node.children.length > 0
            const isTargetedInList = checkedSet.has(node.key)

            if (hasChildren) {
                // 1. Recurse to children first
                const anyChildActive = traverse(node.children!)

                // 2. Strict Logic:
                if (anyChildActive) {
                    // If children are active, parent is NEVER fully checked
                    node.checked = false
                    node.halfChecked = true
                } else if (isTargetedInList) {
                    // Parent ONLY checks itself if its specific key is in the list
                    // AND no children are active.
                    node.checked = true
                    node.halfChecked = false
                } else {
                    // Not in list and no active children = Unchecked
                    node.checked = false
                    node.halfChecked = false
                }
            } else {
                // 3. Leaf Node Logic
                node.checked = isTargetedInList
                node.halfChecked = false
            }

            // Signal up: Is this branch "on" in any capacity?
            if (node.checked || node.halfChecked) {
                anyNodeInLevelIsActive = true
            }
        }

        return anyNodeInLevelIsActive
    }

    traverse(treeData)
}

const SystemFields = [
    'sort',
    'user_created',
    'user_updated',
    'date_created',
    'date_updated',
]

const ExpandableFieldInterfaces = [
    'select-dropdown-m2o',
    'list-o2m',
    'list-o2m-tree-view',
    'list-m2m',
    'files',
]

/** Whether the field should be selected (checked) by default. */
function isDefaultSelectedField(field: DirectusField): boolean {
    if (SystemFields.includes(field.field)) {
        return false
    }

    return true
}

/** Make tree nodes from directus fields, considering relation and parent node */
function makeTreeData({
    fields,
    parent,
}: {
    fields: DirectusField[]
    parent?: TreeNode
}): TreeNode[] {
    return fields
        .map((field) => {
            let key = field.field
            let checked = isDefaultSelectedField(field)
            if (parent) {
                key = `${parent.key}.${field.field}`
                checked = false
            }
            return {
                key,
                isLeaf: isLeaf({ field }),
                checked,
                halfChecked: false,
                parent,
                ...field,
            } satisfies TreeNode
        })
}

/**
 * Update tree nodes based on origin nodes, node to update, directus fields and relation.
 * This function does not mutate the origin nodes. It is used in react setState.
 */
function updateTreeData({
    origin,
    nodeToUpdate,
    fields,
    relation,
}: {
    origin: TreeNode[]
    nodeToUpdate: TreeNode
    fields: DirectusField[]
    relation: Relation
}): TreeNode[] {
    return origin.map((node) => {
        if (node.key == nodeToUpdate.key) {
            // 1. Create the base of the updated node first
            const updatedNode: TreeNode = {
                ...node,
                relation,
            }
            // 2. Now use the updatedNode as the parent so the children
            // reference the "new" version of the node
            updatedNode.children = makeTreeData({
                fields,
                parent: updatedNode,
            })
            return updatedNode
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData({
                    origin: node.children,
                    nodeToUpdate,
                    fields,
                    relation,
                }),
            } satisfies TreeNode
        }
        return node
    })
}

/** Determine leaf node by checking directus field properties */
function isLeaf({
    field,
}: {
    field: DirectusField
}): boolean {
    if (field.meta.interface && ExpandableFieldInterfaces.includes(field.meta.interface)) {
        return false
    }

    if (field.schema?.foreign_key_table) {
        return false
    }

    return true
}

type Relation = M2ORelation | O2MRelation | M2MRelation

interface M2ORelation {
    type: 'm2o'
    collection: string | null
}

interface O2MRelation {
    type: 'o2m'
    collection: string | null
    foreignKey: string | null
}

interface M2MRelation {
    type: 'm2m'
    collection: string | null
    foreignKey: string | null
    junctionField: string | null
}

/**
 * Find relation by checking directus field properties.
 * Its logic should be on par with function `isLeaf`.
 */
function findRelation(relations: DirectusRelation[], treeNode: TreeNode): Relation | null {
    switch (treeNode.meta.interface) {
        case 'select-dropdown-m2o':
            return findRelationM2O(relations, treeNode)
        case 'list-o2m':
        case 'list-o2m-tree-view':
            return findRelationO2M(relations, treeNode)
        case 'list-m2m':
        case 'files':
            return findRelationM2M(relations, treeNode)
    }

    if (treeNode.schema?.foreign_key_table) {
        return findRelationM2O(relations, treeNode)
    }

    return null
}

function findRelationM2O(relations: DirectusRelation[], treeNode: TreeNode): M2ORelation | null {
    const m2o = relations.find((relation) => {
        return relation.meta.many_collection == treeNode.collection
            && relation.meta.many_field == treeNode.field
    })
    if (!m2o) {
        return null
    }
    return {
        type: 'm2o',
        collection: m2o.meta.one_collection,
    } satisfies M2ORelation
}

function findRelationO2M(relations: DirectusRelation[], treeNode: TreeNode): O2MRelation | null {
    const o2m = relations.find((relation) => {
        return relation.meta.one_collection == treeNode.collection
            && relation.meta.one_field == treeNode.field
    })
    if (!o2m) {
        return null
    }
    return {
        type: 'o2m',
        collection: o2m.meta.many_collection,
        foreignKey: o2m.meta.many_field,
    } satisfies O2MRelation
}

function findRelationM2M(relations: DirectusRelation[], treeNode: TreeNode): M2MRelation | null {
    const m2m = relations.find((relation) => {
        return relation.meta.one_collection == treeNode.collection
            && relation.meta.one_field == treeNode.field
    })
    if (!m2m) {
        return null
    }
    return {
        type: 'm2m',
        collection: m2m.meta.many_collection,
        foreignKey: m2m.meta.many_field,
        junctionField: m2m.meta.junction_field,
    } satisfies M2MRelation
}

function CollectionFields({ collection }: { collection: string }) {
    const [treeData, setTreeData] = useState<TreeNode[]>([])

    const checkedKeys = getCheckedKeys(treeData)

    const directus = useDirectus()

    useRequest(async () => {
        const fields = await directus.request(readFieldsByCollection(collection))
        return makeTreeData({
            fields: fields as DirectusField[],
        })
    }, {
        refreshDeps: [collection],
        onSuccess: setTreeData,
    })

    const { data: relations } = useRequest(async () => {
        const relations = await directus.request(readRelations())
        return relations as DirectusRelation[]
    }, {
        refreshDeps: [collection],
    })

    const onLoadData = async (treeNode: TreeNode) => {
        if (!relations) {
            return
        }
        const relation = findRelation(relations, treeNode)
        if (!relation) {
            return
        }
        if (!relation.collection) {
            return
        }
        const fields = await directus.request(readFieldsByCollection(relation.collection))
        setTreeData(origin => updateTreeData({
            origin,
            nodeToUpdate: treeNode,
            fields: fields as DirectusField[],
            relation,
        }))
    }

    const handleCheck = (checked: CheckedKeys) =>
        setTreeData((origin) => {
            const clonedTree = structuredClone(origin)
            setCheckedKeys(clonedTree, checked)
            return clonedTree
        })

    return (
        <>
            <Tree<TreeNode>
                key={collection}
                checkable
                checkedKeys={checkedKeys}
                checkStrictly
                treeData={treeData}
                titleRender={node => <FieldNode node={node} />}
                onCheck={checked => handleCheck(checked as CheckedKeys)}
                loadData={onLoadData}
            />
            <PageCode
                collection={collection}
                treeData={treeData}
                checkedKeys={checkedKeys}
                relations={relations}
            />
        </>
    )
}

function FieldNode({ node }: { node: TreeNode }) {
    return (
        <>
            <span style={{ marginRight: 16 }}>{node.field}</span>
            <span style={{ color: 'gray', marginRight: 8 }}>
                {node.type}
                {node.meta.interface && <span>{`[${node.meta.interface}]`}</span>}
            </span>
            <span style={{ color: '#1677FF' }}>
                {node.relation?.collection}
            </span>
        </>
    )
}

function SearchCollectionInput({
    value,
    onChange,
}: {
    value?: string
    onChange?: (value: string) => void
}) {
    const directus = useDirectus()

    const { data } = useRequest(async () => {
        const collections = await directus.request(readCollections())
        return collections.filter(c => !c.collection.startsWith('directus_'))
    })

    return (
        <Select
            value={value}
            placeholder="输入表名"
            onChange={onChange}
            options={(data ?? []).map(d => ({
                value: d.collection,
            }))}
            showSearch
            style={{ width: '100%', maxWidth: 500, marginBottom: 4 }}
        />
    )
}

interface PageCodeProps {
    collection: string
    treeData: TreeNode[]
    checkedKeys: CheckedKeys
    relations?: DirectusRelation[]
}

function PageCode({
    collection,
    treeData,
    checkedKeys,
    relations,
}: PageCodeProps) {
    const checkedNodes = getTreeNodes(treeData, checkedKeys.checked)
    const halfCheckedNodes = getTreeNodes(treeData, checkedKeys.halfChecked)
    const allCheckedNodes = new Map([...halfCheckedNodes, ...checkedNodes])
    const formItemKeys = getFormItemKeys(checkedNodes)

    const preRef = useRef<HTMLPreElement>(null)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (preRef.current) {
            const text = preRef.current.innerText // Get the text inside <pre>
            await navigator.clipboard.writeText(text)
            setCopied(true)

            // Reset the "Copied!" state after 2 seconds
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <>
            <Button style={{ marginBottom: 4 }} icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={handleCopy} />
            <pre style={{ fontSize: 12 }} ref={preRef}>
                {gen_({
                    collection,
                    treeData,
                    checkedKeys,
                    relations,
                    checkedNodes,
                    halfCheckedNodes,
                    allCheckedNodes,
                    formItemKeys,
                })}
            </pre>
        </>
    )
}

function getFormItemKeys(checkedNodes: Map<string, TreeNode>) {
    const formItemKeys = new Map<string, string | string[]>()
    Array.from(checkedNodes.values())
        .filter(v => !v.parent || v.parent.relation?.type == 'm2o')
        .filter(v => v.key != 'id')
        .filter(v => findRoot(v).type != 'alias')
        .forEach((v) => {
            const parts = v.key.split('.', 2)
            if (parts.length == 1) {
                // It's a top-level key
                formItemKeys.set(parts[0], parts[0])
            } else {
                // It's a nested key (e.g., brand_id.id)
                const [parent, child] = parts
                if (!formItemKeys.has(parent) || typeof formItemKeys.get(parent) === 'string') {
                    formItemKeys.set(parent, [])
                }
                (formItemKeys.get(parent)! as string[]).push(child)
            }
        })
    return formItemKeys
}

/**
 * Searches for a TreeNode by its unique key.
 * Returns the TreeNode if found, otherwise undefined.
 */
function findNodeByKey(nodes: TreeNode[], targetKey: string): TreeNode | undefined {
    for (const node of nodes) {
        if (node.key === targetKey) {
            return node
        }
        if (node.children && node.children.length > 0) {
            const found = findNodeByKey(node.children, targetKey)
            if (found) {
                return found
            }
        }
    }
    return undefined
}

function getTreeNodes(treeData: TreeNode[], keys: string[]): Map<string, TreeNode> {
    const result = new Map<string, TreeNode>()
    for (const key of keys) {
        const node = findNodeByKey(treeData, key)
        if (node) {
            result.set(key, node)
        }
    }
    return result
}

function findRoot(node: TreeNode): TreeNode {
    let current = node
    // Continue moving up the tree as long as a parent exists
    while (current.parent) {
        current = current.parent
    }
    return current
}

interface GenProps extends PageCodeProps {
    checkedNodes: Map<string, TreeNode>
    halfCheckedNodes: Map<string, TreeNode>
    allCheckedNodes: Map<string, TreeNode>
    formItemKeys: Map<string, string | string[]>
}

function gen_(props: GenProps) {
    let output = `${gen_Imports()}
${gen_FormValues(props)}
${gen_CollectionPage(props)}
`
    Array.from(props.allCheckedNodes.values())
        .filter(v => !v.parent)
        .filter(v => v.type == 'alias')
        .forEach((v) => {
            output += gen_RelatedList(props, v)
        })

    return output
}

function gen_Imports() {
    return `import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { ImageUpload } from '@/components/ImageUpload'
import { LookupSelect } from '@/components/LookupSelect'
import { RelatedList } from '@/components/RelatedList'
import { Title } from '@/components/Title'
import type { Item } from '@/components/types'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import type { FormProps } from 'antd'
import { Button, Form, Input, Radio } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from './hooks/use-item-from-page'
`
}

function gen_FormValues({
    checkedNodes,
    allCheckedNodes,
    formItemKeys,
}: GenProps) {
    let output = 'interface FormValues {\n'
    for (const [key, value] of formItemKeys) {
        if (typeof value === 'string') {
            const node = checkedNodes.get(key)
            output += `    ${key}: ${getTypeScriptType(node)}\n`
        } else {
            output += `    ${key}: {\n`
            for (const key2 of value) {
                const node = allCheckedNodes.get(`${key}.${key2}`)
                output += `        ${key2}: ${getTypeScriptType(node)}\n`
            }
            output += '    }\n'
        }
    }
    output += '}\n'
    return output
}

function getTypeScriptType(field: DirectusField | undefined) {
    if (field?.meta.interface == 'select-dropdown') {
        return field.meta.options?.choices.map((x: { value: string }) => `'${x.value}'`).join(' | ')
    }
    if (field?.type == 'text') {
        return 'string'
    }
    if (field?.type == 'integer') {
        return 'number'
    }
    if (field?.type == 'uuid') {
        return 'string'
    }

    return field?.type
}

function toPascalCase(str: string): string {
    if (!str) return ''

    return str
        .split('_') // Split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('') // Join back together
}

function gen_CollectionPage(props: GenProps) {
    const {
        collection,
        formItemKeys,
        checkedNodes,
        allCheckedNodes,
    } = props
    let output = `export function ${toPascalCase(collection)}Page() {
    const {
        navigate,
        directus,
        form,
        id,
        data,
        loading,
        isEdit,
        isDirty,
        fields,
        updatePage,
        handleValuesChange,
    } = useItemFromPage('${collection}', [
`
    for (const [key, node] of checkedNodes) {
        if (findRoot(node).type != 'alias') {
            output += `        '${key}',\n`
        }
    }
    output += '    ])\n'
    output += `
    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('${collection}', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('${collection}', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }
`
    output += `
    return (
        <>
            <Title title="${toPascalCase(collection)}" data={data} />

            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>

                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                </FormAction>

                <div className="form-grid">`
    for (const [key] of formItemKeys) {
        const node = allCheckedNodes.get(key)
        output += `
                    <Form.Item<FormValues> className="form-item" label="${key}" name="${key}">`
        output += gen_FormItemInput(props, node)
        output += `
                    </Form.Item>`
    }
    output += `
                </div>

`
    Array.from(allCheckedNodes.values())
        .filter(v => !v.parent)
        .filter(v => v.type == 'alias')
        .forEach((v) => {
            output += `                {isEdit && <${toPascalCase(v.key)} data={data} />}
`
        })
    output += `
            </Form1>
        </>
    )
}`
    return output
}

function gen_FormItemInput(props: GenProps, node?: TreeNode) {
    if (node?.meta.interface == 'select-dropdown-m2o') {
        return `
                        <LookupSelect
                            collection="${node.relation?.collection}"
                            collectionFields={[${gen_LookupSelect_CollectionFields(props, node)}
                            ]}
                        />`
    }

    if (node?.meta.interface == 'select-dropdown') {
        return `
                        <Radio.Group
                            options={[${gen_RadioGroup_Options(props, node)}
                            ]}
                        />`
    }

    return `
                        <Input />`
}

function gen_LookupSelect_CollectionFields(props: GenProps, node: TreeNode) {
    const { checkedNodes, halfCheckedNodes } = props
    let output = ''
    for (const child of (node.children ?? [])) {
        const c = checkedNodes.get(child.key)
        if (c) {
            const field = `[${c.key.split('.').slice(1).map(x => `'${x}'`).join(', ')}]`
            const title = `'${c.key.split('.').slice(-1)}'`
            output += `
                                { field: ${field}, title: ${title} },`
        }
        const h = halfCheckedNodes.get(child.key)
        if (h) {
            const field = `[${h.key.split('.').slice(1).map(x => `'${x}'`).join(', ')}]`
            const title = `'${h.key.split('.').slice(-1)}'`
            output += `
                                { field: ${field}, title: ${title} },`
            output += gen_LookupSelect_CollectionFields(props, h)
        }
    }
    return output
}

function gen_RadioGroup_Options(_props: GenProps, node: TreeNode) {
    let output = ''
    node.meta.options?.choices.map((x: { value: string }) => {
        output += `
                                { value: '${x.value}', label: '${x.value}' },`
    })
    return output
}

function gen_RelatedList(props: GenProps, node: TreeNode) {
    const {
        relations,
    } = props
    if (!relations) {
        return
    }
    const relation = findRelation(relations, node)
    if (!relation) {
        return
    }
    if (relation.type != 'o2m' && relation.type != 'm2m') {
        return
    }
    let output = `
function ${toPascalCase(node.key)}({ data }: { data?: Item }) {
    return (
        <Form.Item layout="vertical" label="${node.key}">
            <RelatedList
                foreignKeyField="${relation.foreignKey}"
                foreignKeyValue={data?.id}
                collection="${relation.collection}"
                collectionFields={[`
    output += gen_RelatedList_CollectionFields(props, node)
    output += `
                ]}
            />
        </Form.Item>
    )
}
`
    return output
}

function gen_RelatedList_CollectionFields(props: GenProps, node: TreeNode) {
    const { checkedNodes, halfCheckedNodes } = props
    let output = ''
    for (const child of (node.children ?? [])) {
        const c = checkedNodes.get(child.key)
        if (c) {
            const field = `[${c.key.split('.').slice(1).map(x => `'${x}'`).join(', ')}]`
            const title = `'${c.key.split('.').slice(-1)}'`
            output += `
                    { field: ${field}, title: ${title} },`
        }
        const h = halfCheckedNodes.get(child.key)
        if (h) {
            const field = `[${h.key.split('.').slice(1).map(x => `'${x}'`).join(', ')}]`
            const title = `'${h.key.split('.').slice(-1)}'`
            output += `
                    { field: ${field}, title: ${title} },`
            output += gen_RelatedList_CollectionFields(props, h)
        }
    }
    return output
}

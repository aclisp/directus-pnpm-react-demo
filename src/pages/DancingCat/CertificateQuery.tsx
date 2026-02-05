import type { Item } from '@/components/types'
import { useDirectus } from '@/directus'
import { asset } from '@/directus/assets'
import { readItems } from '@directus/sdk'
import { useMount } from 'ahooks'
import { Image as AntImage, App, Button, Divider, Form, Input, Radio, Skeleton, type FormProps } from 'antd'
import { useRef, useState } from 'react'
import styles from './CertificateQuery.module.css'

interface FormValues {
    certificate_type: 'student' | 'teacher' | 'institute'
    awarded_to: string
    // id_type: 'id_card' | 'passport' | 'id_card_hk' | 'others'
    // id_number: string
}

export default function CertificateQuery() {
    const [certs, setCerts] = useState<Item[]>()

    return (
        <div className={styles.page}>
            <title>证书查询</title>
            {certs
                ? <QueryResult certs={certs} />
                : <QueryForm setCerts={setCerts} />}
        </div>
    )
}

function QueryResult({
    certs,
}: {
    certs: Item[]
}) {
    return (
        <>
            <div className={styles.header}>证书信息</div>
            {certs.map((cert: Item) => <Certificate key={cert.id} cert={cert} />)}
        </>
    )
}

function drawProgram(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, text: string) {
    if (!text) return
    const maxWidth = 360
    const minFontSize = 10 // Don't let it get microscopic
    let fontSize = Math.floor(canvas.width / 48)
    // The "Shrink to Fit" Loop
    ctx.font = `${fontSize}px sans-serif`
    while (ctx.measureText(text).width > maxWidth && fontSize > minFontSize) {
        fontSize--
        ctx.font = `${fontSize}px sans-serif`
    }
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 3 - 46, canvas.height / 2)
}

function drawCategory(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, text: string) {
    if (!text) return
    const fontSize = Math.floor(canvas.width / 48)
    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width - 290, canvas.height / 2 - 55)
}

function drawAwardedName(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, text: string) {
    if (!text) return
    const fontSize = Math.floor(canvas.width / 48)
    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 5, canvas.height / 2 - 99)
}

function drawTeamName(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, text: string) {
    if (!text) return
    const fontSize = Math.floor(canvas.width / 48)
    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2 + 50, canvas.height / 2)
}

function drawCertificateNumber(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, text: string) {
    if (!text) return
    ctx.fillStyle = '#F6EFE6'
    ctx.fillRect(260, 158, 200, 20)
    const fontSize = Math.floor(canvas.width / 80)
    ctx.font = `${fontSize}px serif`
    ctx.fillStyle = '#B5A783'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 262, 168)
}

function Certificate({
    cert,
}: {
    cert: Item
}) {
    const directus = useDirectus()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [imageSrc, setImageSrc] = useState<string>()

    useMount(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = asset(directus, cert.certificate.image)!
        img.onload = () => {
            // Set internal canvas resolution to match source image
            canvas.width = img.width
            canvas.height = img.height
            // Draw the image
            ctx.drawImage(img, 0, 0)
            drawProgram(canvas, ctx, cert.winning_program)
            drawCategory(canvas, ctx, cert.category?.name)
            drawAwardedName(canvas, ctx, cert.awarded_to)
            drawTeamName(canvas, ctx, cert.team_name)
            drawCertificateNumber(canvas, ctx, cert.certificate_number)
            setImageSrc(canvas.toDataURL())
        }
    })

    const item = (
        <div>
            <ItemAttr label="持有人" value={cert.awarded_to} />
            <ItemAttr label="证书名称" value={cert.project.name} />
            <ItemAttr label="证书编号" value={cert.certificate_number} />
            <ItemAttr label="荣获奖项" value={cert.certificate.name} />
            <AntImage width="100%" alt={cert.certificate.name} src={imageSrc} />
            <Divider size="middle" />
        </div>
    )

    return (
        <>
            {!imageSrc && <Skeleton.Image active />}
            {
                imageSrc
                    ? item
                    : <canvas ref={canvasRef} style={{ width: '100%', height: '2rem' }} />
            }
        </>
    )
}

function ItemAttr({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className={styles['item-attr']}>
            <div className={styles['item-attr-label']}>{label}</div>
            <div>{value}</div>
        </div>
    )
}

function QueryForm({
    setCerts,
}: {
    setCerts: (data: Item[]) => void
}) {
    const [form] = Form.useForm<FormValues>()
    const directus = useDirectus()
    const [querying, setQuerying] = useState(false)
    const { modal } = App.useApp()

    useMount(() => {
        form.setFieldsValue({
            certificate_type: 'student',
            awarded_to: '',
            // id_type: 'id_card',
            // id_number: '',
        })
    })

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setQuerying(true)
        // await new Promise(resolve => setTimeout(resolve, 2000))
        const data = await directus.request(readItems('cat_awards', {
            fields: [
                'id',
                'project.name',
                'certificate_number',
                'awarded_to',
                'category.name',
                'winning_program',
                'certificate.name',
                'certificate.image',
                'team_name',
            ],
            filter: {
                _and: [
                    // { id_number: { _eq: values.id_number } },
                    { awarded_to: { _eq: values.awarded_to } },
                    { status: { _eq: 'published' } },
                    { certificate_type: { name: { _eq: values.certificate_type } } },
                    // { id_type: { name: { _eq: values.id_type } } },
                ],
            },
        })).finally(() => setQuerying(false))
        if (data.length === 0) {
            modal.warning({
                title: '没有查询到证书',
            })
            return
        }
        setCerts(data)
    }

    return (
        <Form form={form} onFinish={onFinish} className={styles.form} layout="vertical">
            <Form.Item<FormValues> label="证书类别" name="certificate_type" rules={[{ required: true }]}>
                <Radio.Group options={[
                    { value: 'student', label: '学员' },
                    { value: 'teacher', label: '教师' },
                    { value: 'institute', label: '机构' },
                ]}
                />
            </Form.Item>
            <Form.Item<FormValues> label="姓名" name="awarded_to" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            {/* <Form.Item<FormValues> label="证件类型" name="id_type" rules={[{ required: true }]}>
                <Select options={[
                    { value: 'id_card', label: '身份证' },
                    { value: 'passport', label: '护照' },
                    { value: 'id_card_hk', label: '港澳台居住证/身份证' },
                    { value: 'others', label: '其他' },
                ]}
                />
            </Form.Item>
            <Form.Item<FormValues> label="证件号码" name="id_number" rules={[{ required: true }]}>
                <Input />
            </Form.Item> */}
            <Form.Item label={null} className={styles['form-buttons']}>
                <Button loading={querying} size="large" type="primary" htmlType="submit">
                    {querying ? '请稍候' : '查询'}
                </Button>
            </Form.Item>
        </Form>
    )
}

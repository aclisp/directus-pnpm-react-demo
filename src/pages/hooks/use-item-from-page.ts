import { useItem } from '@/hooks/use-item'
import { queryToNestedObject } from '@/utils/query-to-nested-object'
import { useParams, useSearchParams } from 'react-router'

/**
 * This hook can only be called from the Page component.
 */
export function useItemFromPage(collection: string, fields: string[]) {
    const { id } = useParams() // Depends on the Page's url
    const [searchParams] = useSearchParams() // Depends on the Page's url
    // The prefilled data is coming from the Page's url query string
    const prefill = queryToNestedObject(searchParams)
    return useItem(collection, id!, { fields, prefill })
}

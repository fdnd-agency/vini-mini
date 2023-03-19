import { gql } from 'graphql-request'
import { hygraph_hp } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let first = Number(url.searchParams.get('first') ?? 10)
  let skip = Number(url.searchParams.get('skip') ?? 0)
  let direction = url.searchParams.get('direction') === 'ASC' ? 'ASC' : 'DESC'
  let orderBy = (url.searchParams.get('orderBy') ?? 'publishedAt') + '_' + direction

  const query = gql`
    query getCategorie($first: Int, $skip: Int, $orderBy: CategorieOrderByInput) {
      categories(first: $first, skip: $skip, orderBy: $orderBy) {
        titel
        beschrijving {
          html
        }
        plaatjes {
          url
        }
        producten {
          titel
          slug
          tagline
          prijs
          plaatjes {
            url
          }
        }
      }
      categoriesConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
          pageSize
        }
      }
    }
  `
  const data = await hygraph_hp.request(query, { first, skip, orderBy })
  return new Response(JSON.stringify(data), responseInit)
}

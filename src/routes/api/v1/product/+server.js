import { gql } from 'graphql-request'
import { hygraph_hp } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let id = url.searchParams.get('id') ?? false

  const query = gql`
    query getProduct($id: ID) {
      product(where: { id: $id }) {
        id
        titel
        slug
        tagline
        prijs
        categorie {
          titel
          beschrijving {
            html
          }
          plaatjes {
            url
            height
            width
            original: url
            small: url(transformation: { image: { resize: { width: 500, fit: clip } } })
            originalAsWebP: url(transformation: { document: { output: { format: webp } } })
            smallAsWebP: url(transformation: { image: { resize: { width: 500, fit: clip } } document: { output: { format: webp } } })
          }
        }
        beschrijving {
          html
        }
        plaatjes {
          url
          height
          width
          original: url
          small: url(transformation: { image: { resize: { width: 500, fit: clip } } })
          originalAsWebP: url(transformation: { document: { output: { format: webp } } })
          smallAsWebP: url(transformation: { image: { resize: { width: 500, fit: clip } } document: { output: { format: webp } } })
        }
        schema {
          titel
          beschrijving {
            html
          }
          stappen {
            titel
            beschrijving {
              html
            }
            gap
          }
          plaatjes {
            url
            height
            width
            original: url
            small: url(transformation: { image: { resize: { width: 500, fit: clip } } })
            originalAsWebP: url(transformation: { document: { output: { format: webp } } })
            smallAsWebP: url(transformation: { image: { resize: { width: 500, fit: clip } } document: { output: { format: webp } } })
          }
        }
        tips {
          tekst
        }
      }
      productenConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
          pageSize
        }
      }
    }
  `
  const data = await hygraph_hp.request(query, { id })
  return new Response(JSON.stringify(data), responseInit)
}

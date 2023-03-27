import { gql } from 'graphql-request'
import { hygraph_hp } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let first = Number(url.searchParams.get('first') ?? 10)
  let skip = Number(url.searchParams.get('skip') ?? 0)
  let direction = url.searchParams.get('direction') === 'ASC' ? 'ASC' : 'DESC'
  let orderBy = (url.searchParams.get('orderBy') ?? 'publishedAt') + '_' + direction
  let data;
  let categorieId = url.searchParams.get('categorieId') ?? false
  if (categorieId) {
    const query = gql`
      query getProducten($categorieId: ID, $first: Int, $skip: Int, $orderBy: ProductOrderByInput) {
        producten(where: {categorie: {id: $categorieId}}, first: $first, skip: $skip, orderBy: $orderBy) {
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
            }
          }
          beschrijving {
            html
          }
          plaatjes {
            url
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
    data = await hygraph_hp.request(query, { categorieId, first, skip, orderBy })
  } else {
    const query = gql`
      query getProducten($first: Int, $skip: Int, $orderBy: ProductOrderByInput) {
        producten(first: $first, skip: $skip, orderBy: $orderBy) {
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
            }
          }
          beschrijving {
            html
          }
          plaatjes {
            url
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
    data = await hygraph_hp.request(query, { first, skip, orderBy })
  }

  return new Response(JSON.stringify(data), responseInit)
}

export async function GET({ url }) {
  let first = Number(url.searchParams.get('first') ?? 10)
  let skip = Number(url.searchParams.get('skip') ?? 0)
  let direction = url.searchParams.get('direction') === 'ASC' ? 'ASC' : 'DESC'
  let orderBy = (url.searchParams.get('orderBy') ?? 'publishedAt') + '_' + direction

  const query = gql`
    query getProducten($first: Int, $skip: Int, $orderBy: ProductOrderByInput) {
      producten(first: $first, skip: $skip, orderBy: $orderBy) {
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
  const data = await hygraph.request(query, { first, skip, orderBy })
  return new Response(JSON.stringify(data), responseInit)
}

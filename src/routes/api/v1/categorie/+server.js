export async function GET({ url }) {
  let first = Number(url.searchParams.get('first') ?? 10)
  let skip = Number(url.searchParams.get('skip') ?? 0)
  let direction = url.searchParams.get('direction') === 'ASC' ? 'ASC' : 'DESC'
  let orderBy = (url.searchParams.get('orderBy') ?? 'publishedAt') + '_' + direction

  const query = gql`
    query getCategorie($first: Int, $skip: Int, $orderBy: ProductOrderByInput) {
      caegorieen(first: $first, skip: $skip, orderBy: $orderBy) {
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

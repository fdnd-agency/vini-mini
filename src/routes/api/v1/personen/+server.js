import { gql } from 'graphql-request'
import { hygraph_hp } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let data;
  if (url.searchParams.get('id')) {
    let id = url.searchParams.get('id')
    const query = gql`
      query getPersoon($id: ID!) {
        personen(where: {id: $id}) {
          id
          naam
          tussenvoegsel
          achternaam
          notities {
            id
            titel
            beschrijving
            datum
          }
          gezin {
            id
            naam
            tussenvoegsel
            achternaam
          }
        }
      }
    `
    data = await hygraph_hp.request(query, { id })
  } else {
    let first = Number(url.searchParams.get('first') ?? 10)
    let skip = Number(url.searchParams.get('skip') ?? 0)
    let direction = url.searchParams.get('direction') === 'ASC' ? 'ASC' : 'DESC'
    let orderBy = (url.searchParams.get('orderBy') ?? 'publishedAt') + '_' + direction

    const query = gql`
      query getPersonen($first: Int, $skip: Int, $orderBy: PersoonOrderByInput) {
        personen(first: $first, skip: $skip, orderBy: $orderBy) {
          id
          naam
          tussenvoegsel
          achternaam
          notities {
            id
            titel
            beschrijving
            datum
          }
          gezin {
            id
            naam
            tussenvoegsel
            achternaam
          }
        }
        personenConnection {
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

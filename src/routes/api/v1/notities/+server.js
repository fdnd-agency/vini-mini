import { gql } from 'graphql-request'
import { hygraph } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let id = url.searchParams.get('id') ?? null

  const query = gql`
    query getNotities($id: ID) {
      notities(where: { persoon: { id: $id } }) {
        titel
        beschrijving
        datum
        herinnering
        afgerond
        persoon {
          id
        }
      }
    }
  `
  const data = await hygraph.request(query, { id })
  return new Response(JSON.stringify(data), responseInit)
}

export async function POST({ request }) {
  const requestData = await request.json()
  let errors = []

  // Controleer de request data op juistheid
  // if (!requestData.author || typeof requestData.author !== 'string') {
  //   errors.push({ field: 'author', message: 'author should exist and have a string value' })
  // }
  // if (!requestData.text || typeof requestData.text !== 'string') {
  //   errors.push({ field: 'text', message: 'text should exist and have a string value' })
  // }
  // if (!requestData.methodId) {
  //   errors.push({ field: 'methodId', message: 'methodId should exist' })
  // }

  // Als we hier al errors hebben in de form data sturen we die terug
  if (errors.length > 0) {
    return new Response(
      JSON.stringify({
        method: 'POST',
        working: 'yes',
        succes: false,
        errors: errors,
      })
    )

    // Geen errors, voeg het comment toe
  } else {
    // Bereid de mutatie voor
    const mutation = gql`
      mutation createNotitie(
        $titel: String!
        $beschrijving: String!
        $datum: DateTime!
        $herinnering: [DateTime!]
        $afgerond: Boolean!
        $persoonId: ID!
      ) {
        createNotitie(
          data: {
            titel: $titel
            beschrijving: $beschrijving
            datum: $datum
            herinnering: $herinnering
            afgerond: $afgerond
            persoon: { connect: { id: $persoonId } }
          }
        ) {
          id
        }
      }
    `

    // Bereid publiceren voor
    const publication = gql`
      mutation publishNotitie($id: ID!) {
        publishNotitie(where: { id: $id }, to: PUBLISHED) {
          id
        }
      }
    `

    // Voer de mutatie uit
    const data = await hygraph
      .request(mutation, { ...requestData })
      // Stuur de response met created id door
      .then((data) => {
        return (
          hygraph
            // Voer de publicatie uit met created id
            .request(publication, { id: data.createNotitie.id ?? null })
            // Vang fouten af bij het publiceren
            .catch((error) => {
              errors.push({ field: 'HyGraph', message: error })
            })
        )
      })
      // Vang fouten af bij de mutatie
      .catch((error) => {
        errors.push({ field: 'HyGraph', message: error })
      })

    return new Response(
      JSON.stringify({
        method: 'POST',
        working: 'yes',
        success: data && data.publishNotitie ? true : false,
        data: data && data.publishNotitie,
        errors: errors,
      }),
      responseInit
    )
  }
}

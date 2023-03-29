import { gql } from 'graphql-request'
import { hygraph } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let id = url.searchParams.get('id') ?? null

  const query = gql`
    query getNotities($id: ID) {
      notities(where: { persoon: { id: $id } } first:100) {
        id
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
  if (!requestData.titel || typeof requestData.titel !== 'string') {
    errors.push({ field: 'titel', message: 'titel should exist and have a string value' })
  }
  if (!requestData.beschrijving || typeof requestData.beschrijving !== 'string') {
    errors.push({ field: 'beschrijving', message: 'beschrijving should exist and have a string value' })
  }
  if (!requestData.datum || typeof requestData.datum !== 'string') {
    errors.push({
      field: 'datum',
      message:
        'datum should exist and have a RFC 3339 value (1978-11-20T09:00:00Z). See: https://ijmacd.github.io/rfc3339-iso8601/',
    })
  }
  if (!requestData.herinnering) {
    errors.push({
      field: 'herinnering',
      message:
        'herinnering should exist and have a RFC 3339 array value (["1978-11-20T09:00:00Z", "1978-11-21T09:00:00Z", ...]). See https://ijmacd.github.io/rfc3339-iso8601/',
    })
  }
  if (typeof requestData.afgerond !== 'boolean') {
    errors.push({ field: 'afgerond', message: 'afgerond should exist and have a boolean (true/false) value' })
  }
  if (!requestData.persoonId) {
    errors.push({ field: 'persoonId', message: 'persoonId should exist' })
  }

  // Als we hier al errors hebben in de form data sturen we die terug
  if (errors.length > 0) {
    return new Response(
      JSON.stringify({
        method: 'POST',
        working: 'yes',
        succes: false,
        status: 400,
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

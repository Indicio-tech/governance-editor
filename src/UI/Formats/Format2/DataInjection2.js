import { setGovernanceParticipants } from "../../../redux/governanceReducer"

// (eldersonar) Handle participants assembly
export const handleParticipantsInjection2_0 = (governanceFile, dispatch) => {
  let participants = []
  let participant_id = 1
  let roles =
    governanceFile.participants.entries["https://example.com/roles.schema.json"]
  let descriptions =
    governanceFile.participants.entries[
      "https://example.com/description.schema.json"
    ]

  console.log(roles)
  console.log(descriptions)

  for (const did in roles) {
    let participant = {}
    participant.participant_id = participant_id
    participant.did = did
    participant.governance_id = governanceFile.id
    participant.email = descriptions[did].email
    participant.name = descriptions[did].name
    participant.phone = descriptions[did].phone
    participant.website = descriptions[did].website
    participant.address = descriptions[did].address
    participant.city = descriptions[did].city
    participant.zip = descriptions[did].zip
    participant.state = descriptions[did].state
    participant.roles = []

    for (const role of roles[did].roles) {
      participant.roles.push(role)
    }
    participants.push(participant)
    participant_id++
  }

  dispatch(setGovernanceParticipants(participants))
}

import { setGovernanceIssuers } from "../../../redux/governanceReducer"

// (eldersonar) Handle issuers assembly
export const handleIssuersInjection2_0 = (governanceFile, dispatch) => {
  let issuers = []
  let issuer_id = 1
  for (let key in governanceFile.participants.entries) {
    let issuer = {}
    if (governanceFile.participants.entries.hasOwnProperty(key)) {
      issuer.issuer_id = issuer_id
      issuer.did = key
      issuer.governance_id = governanceFile.id
      issuer.email =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].email
      issuer.name =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].name
      issuer.phone =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].phone
      issuer.website =
        governanceFile.participants.entries[key][
          "uri:to-describe_schema"
        ].website
      issuer.address =
        governanceFile.participants.entries[key][
          "uri:to-describe_schema"
        ].address
      issuer.city =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].city
      issuer.zip =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].zip
      issuer.state =
        governanceFile.participants.entries[key]["uri:to-describe_schema"].state
      issuer.roles =
        governanceFile.participants.entries[key]["uri:to-role_schema"].roles

      issuers.push(issuer)

      // Increment for unique id
      issuer_id++
    }
  }
  dispatch(setGovernanceIssuers(issuers))
}

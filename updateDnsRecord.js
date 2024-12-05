import axios from "axios"

export const updateDnsRecord = async (newIp = '') => {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const dnsRecordId = process.env.CLOUDFLARE_DNS_RECORD_ID
  const url = 'https://api.cloudflare.com/client/v4/zones/'+ zoneId + '/dns_records/' + dnsRecordId

  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN
  const body = {
    comment: "Public IP changed",
    name: "vocab-boost.site",
    proxied: true,
    settings: {},
    tags: [],
    ttl: 1,
    content: newIp,
    type: "A"
  }

  await axios.patch(url, body, {
    headers: { Authorization: 'Bearer ' + cfApiToken }
  }).then(() => {
    console.log("Update DNS success")
  }).catch(error => {
    console.log("Update DNS lỗi, " + error.message)
  })
}

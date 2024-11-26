import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_tree: {
      optionalProperties: {
        product_groups: { elements: { additionalProperties: true, properties: {} } },
      }
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          product_status: {
            additionalProperties: true,
            optionalProperties: {
              known_affected: { elements: { type: 'string' } },
              known_not_affected: { elements: { type: 'string' } },
              under_investigation: { elements: { type: 'string' } },
            },
          },
          remediations: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                category: { type: 'string' },
                product_ids: { elements: { type: 'string' } }
              }
            }
          }
        }
      }
    }
  }
})

const validate = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export default function mandatoryTest_6_1_36(doc) {
  /** @type {any} */
  const _doc = doc
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true
  }

  if (!validate(doc)) {
    return ctx
  }

  /** @type {any} */
  _doc.vulnerabilities.forEach((/** @type {any} */vulnerability, /** @type {number} */vulnerabilityIndex) => {
    const productStatuses = new Map()

    // Collect product statuses
    Object.entries(vulnerability.product_status || {}).forEach(
      ([status, productIds]) => {
        productIds.forEach((/** @type {any} */productId) => {
          if (!productStatuses.has(productId)) {
            productStatuses.set(productId, [])
          }
          productStatuses.get(productId).push(status)
        })
      }
    )

    // Validate remediations against product statuses
    vulnerability.remediations.forEach((/** @type {any} */remediation, /** @type {number} */remediationIndex) => {
      remediation.product_ids?.forEach((/** @type {any} */productId) => {
        const statuses = productStatuses.get(productId) || []

        if (statuses.includes('known_not_affected')) {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/remediations/${remediationIndex}`,
            message: `Product ${productId} has remediation "${remediation.category}" but is marked as "known_not_affected"`
          })
        }
      })
    })
  })

  return ctx
}

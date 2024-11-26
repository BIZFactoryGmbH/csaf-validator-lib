import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        product_groups: {
          elements: {
            optionalProperties: {
              group_id: { type: 'string' },
              product_ids: {
                elements: { type: 'string' },
              },
            },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        properties: {
          remediations: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                category: { type: 'string' },
                product_ids: { elements: { type: 'string' } },
              },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @type {Record<string, number>}
 */
const remediationPriority = {
  vendor_fix: 1,
  mitigation: 2,
  workaround: 3,
  fix_planned: 4,
  no_fix_planned: 5,
  optional_patch: 6,
  none_available: 7,
};

/**
 * @param {any} doc
 */
export default function mandatoryTest_6_1_35(doc) {
  const ctx = {
    errors: /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((/** @type {any} */ vulnerability, /** @type {number} */vulnerabilityIndex) => {
    const productRemediations = new Map()

    vulnerability.remediations.forEach((/** @type {any} */remediation, /** @type {number} */remediationIndex) => {
      // Collect product IDs directly from the remediation.
      remediation.product_ids?.forEach((/** @type {any} */productId) => {
        if (!productRemediations.has(productId)) {
          productRemediations.set(productId, [])
        }

        const existingCategories = productRemediations.get(productId)

        // Check for conflicting remediation categories for this product.
        const conflictingCategory = existingCategories.find(
          (/** @type {any} */existingCategory) =>
            remediationPriority[existingCategory] !== remediationPriority[remediation.category]
        );

        if (conflictingCategory) {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/remediations/${remediationIndex}`,
            message: `Product ${productId} is in conflicting remediation categories: ${conflictingCategory} and ${remediation.category}`,
          })
        } else {
          existingCategories.push(remediation.category)
        }
      })
    })
  })

  return ctx
}

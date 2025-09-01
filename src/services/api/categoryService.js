const tableName = 'category_c'

export const categoryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
      }

      const response = await apperClient.fetchRecords(tableName, params)

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      }

      const response = await apperClient.getRecordById(tableName, parseInt(id), params)

      if (!response.success || !response.data) {
        throw new Error("Category not found")
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error)
      throw new Error("Category not found")
    }
  }
}
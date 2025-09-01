const tableName = 'task_c'

export const taskService = {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "status_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords(tableName, params)

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "status_c"}}
        ]
      }

      const response = await apperClient.getRecordById(tableName, parseInt(id), params)

      if (!response.success || !response.data) {
        throw new Error("Task not found")
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      throw new Error("Task not found")
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description || "",
          completed_c: false,
          category_c: taskData.category,
          priority_c: taskData.priority,
          due_date_c: taskData.dueDate,
          created_at_c: new Date().toISOString(),
          order_c: 1,
          status_c: taskData.status || "pending"
        }]
      }

      const response = await apperClient.createRecord(tableName, params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:${JSON.stringify(failed)}`)
          throw new Error("Failed to create task")
        }
        
        return successful[0]?.data
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.title && { Name: updateData.title, title_c: updateData.title }),
          ...(updateData.description !== undefined && { description_c: updateData.description }),
          ...(updateData.completed !== undefined && { completed_c: updateData.completed }),
          ...(updateData.category && { category_c: updateData.category }),
          ...(updateData.priority && { priority_c: updateData.priority }),
          ...(updateData.dueDate && { due_date_c: updateData.dueDate }),
          ...(updateData.status && { status_c: updateData.status }),
          ...(updateData.order !== undefined && { order_c: updateData.order })
        }]
      }

      const response = await apperClient.updateRecord(tableName, params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:${JSON.stringify(failed)}`)
          throw new Error("Failed to update task")
        }
        
        return successful[0]?.data
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = { 
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord(tableName, params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:${JSON.stringify(failed)}`)
          throw new Error("Failed to delete task")
        }
        
        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      throw error
    }
  },

  async toggleComplete(id) {
    try {
      const task = await this.getById(id)
      return await this.update(id, { completed: !task.completed_c })
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error)
      throw error
    }
  },

  async reorderTasks(reorderedTasks) {
    try {
      const updatePromises = reorderedTasks.map((task, index) =>
        this.update(task.Id, { order: index + 1 })
      )
      
      await Promise.all(updatePromises)
      return await this.getAll()
    } catch (error) {
      console.error("Error reordering tasks:", error?.response?.data?.message || error)
      throw error
    }
  }
}
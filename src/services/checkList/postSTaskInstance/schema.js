const schema = {
  tags: ['CheckList'],
  summary: 'postSubTask',
  description: 'create intance of the task',
  body: {
    type: 'object',
    properties: {
      subTaskId: {
        type: 'integer',
        format: 'int32',
        description: 'Identifier for the related subtask'
      },
      userId: {
        type: 'integer',
        format: 'int32',
        description: 'Identifier for the user who is assigned to the subtask'
      },
      status: {
        type: 'string',
        description: 'The status of the subtask'
      },
      dateTime: {
        type: 'string',
        format: 'date-time',
        description: 'The date and time when the subtask was updated'
      },
      comment: {
        type: 'string',
        description: 'Any comment related to the subtask'
      },
      score: {
        type: 'integer',
        description: 'Additional information about the score'
      },
      photo: {
        type: 'string',
        description: 'URL to a photo related to the subtask'
      }
    }
  },
  response: {
    201: {
      description: "Successfully created STaskInstance",
            type: "object",
            properties: {
              id: {
                type: "integer",
                format: "int64",
                description: "Unique identifier for the STaskInstance"
              },
              subTask_id: {
                type: "integer",
                format: "int32",
                description: "Identifier for the related subtask"
              },
              user_id: {
                type: "integer",
                format: "int32",
                description: "Identifier for the user who is assigned to the subtask"
              },
              status: {
                type: "string",
                description: "The status of the subtask"
              },
              dateTime: {
                type: "string",
                format: "date-time",
                description: "The date and time when the subtask was updated"
              },
              comment: {
                type: "string",
                description: "Any comment related to the subtask"
              },
              row: {
                type: "string",
                description: "Additional information about the row"
              },
              photo: {
                type: "string",
                description: "URL to a photo related to the subtask"
              }
      }
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    401: {
      description: 'Invalid username or password',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    404: {
      description: 'Could not provision',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    500: {
      description: 'Generic server error',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}

module.exports = schema

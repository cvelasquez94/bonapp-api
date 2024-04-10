const schema = {
  tags: ['CheckList'],
  summary: 'createChecklist',
  description: 'createChecklist',
  body: {
    type: 'object',
    required: ['name', 'type', 'mainTasks'],
    properties: {
      id: { type: 'integer', },
      role_id: { type: 'integer', },
      name: { type: 'string' },
      desc: { type: 'string' },
      type: { type: 'string' },
      enable: { type: 'integer' },
      schedule_start: { 
        type: 'string',
        format: 'date-time', },
      schedule_end: { 
        type: 'string',
        format: 'date-time', },
      mainTasks: {
          type: 'array',
          required: ['name', 'orden', 'subTasks'],
          items: {
            type: 'object',
            properties: {
              //id: { type: 'integer' },
              name: { type: 'string' },
              desc: { type: 'string' },
              schedule_start: { type: 'string', format: 'date-time', },
              schedule_end: { type: 'string', format: 'date-time', },
              //checkList_id: { type: 'integer' },
              orden: { type: 'integer' },
              enable: { type: 'integer' },
              subTasks: {
                type: 'array',
                required: ['name', 'orden'],
                items: {
                  type: 'object',
                  properties: {
                    //id: { type: 'integer' },
                    name: { type: 'string' },
                    desc: { type: 'string' },
                    expiration: { type: 'string', format: 'date-time', },
                    //mainTask_id: { type: 'integer' },
                    scoreMultiplier: { type: 'integer' },
                    orden: { type: 'integer' },
                    enable: { type: 'integer' },
                  }
                }
              }
            }
          }
        }
    },
  },
  response: {
    200: {
      description: 'Checklist created',
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
    },201: {
      description: 'Checklist Created',
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    404: {
      description: 'Could not provision',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    500: {
      description: 'Generic server error',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

module.exports = schema;

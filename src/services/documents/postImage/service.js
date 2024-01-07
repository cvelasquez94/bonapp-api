module.exports = (fastify) => {
    const { Document } = fastify.db
    async function postImage(data) {
      try {
        console.log(data)
        const document = Document.create(data)
        if(!document) {
          throw new Error('Document fail')
        }
        return document
      } catch (error) {
        throw new Error(error)
      }
    }
  
    return {
      postImage
    }
  }
  
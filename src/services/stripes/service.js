
module.exports = (fastify) => {
  async function getStrip(category, search) {
    try {
        const srtip = [{
            ID: 1,
            FileName: 'video1.mp4',
            FileType: 'mp4',
            FileSize: 1024000,
            FilePath: 'files/TEST-MP4.mp4',
            Category: '',
            Preview: 'https://www.dochipo.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/08/YouTube-Thumbnail-_-Food-2.png.webp',
            Description: 'MP4 video file example.',
            Rating: 0,
            Duration: 30,
            label: 'New',
        },{
            ID: 2,
            FileName: 'Wearing a chefs Hat',
            FileType: '',
            FileSize: 0,
            FilePath: 'files/TEST-MP4.mp4',
            Category: '',
            Preview: '',
            Description: '',
            Rating: 0,
            Duration: 10,
            label: 'New',
        }]
        return srtip
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getStrip
  }
}

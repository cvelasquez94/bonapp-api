
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
            Rating: 11,
            RatingQty: 543,
            Duration: 30,
            label: 'New',
        },{
            ID: 2,
            FileName: 'Wearing a chefs Hat',
            FileType: '',
            FileSize: 0,
            FilePath: 'files/TEST-MP4.mp4',
            Category: '',
            Preview: 'https://www.dochipo.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/08/YouTube-Thumbnail-_-Food-2.png.webp',
            Description: 'Titulín',
            Rating: 0,
            RatingQty: 0,
            Duration: 10,
            label: '',
        },{
          ID: 3,
          FileName: 'Testing a test',
          FileType: '',
          FileSize: 0,
          FilePath: 'files/TEST-MP4.mp4',
          Category: '',
          Preview: 'https://img.lovepik.com/background/20211022/large/lovepik-taobao-tmall-e-commerce-banner-background-image_500603827.jpg',
          Description: '',
          Rating: 3.3,
          RatingQty: 30,
          Duration: 6,
          label: 'testt',
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

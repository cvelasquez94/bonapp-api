
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
            Preview: 'https://res.cloudinary.com/cvelasquez/image/upload/v1716558002/7DFFE908-9B7C-4C5A-A87E-4149E81BD410_khihtw.jpg',
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
            Preview: 'https://res.cloudinary.com/cvelasquez/image/upload/v1716557208/F74A1FF2-1616-401F-93D7-76AC71E60EFC_qy3edm.jpg',
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
          Preview: 'https://res.cloudinary.com/cvelasquez/image/upload/v1716558838/D9E3A8D1-125F-4CB4-9C14-96B407AF6C71_k4yck8.jpg',
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

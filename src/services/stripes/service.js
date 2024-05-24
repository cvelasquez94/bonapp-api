
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
<<<<<<< HEAD
            Preview: 'https://www.dochipo.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/08/YouTube-Thumbnail-_-Food-2.png.webp',
            Description: 'Video example!',
=======
            Preview: 'https://res.cloudinary.com/cvelasquez/image/upload/v1716558002/7DFFE908-9B7C-4C5A-A87E-4149E81BD410_khihtw.jpg',
            Description: 'MP4 video file example.',
>>>>>>> ebe29e8d119cdec7400b750b82b542db511e008d
            Rating: 11,
            RatingQty: 543,
            Duration: 30,
            label: 'New',
        },{
            ID: 2,
            FileName: 'video1.mp4',
            FileType: 'mp4',
            FileSize: 0,
            FilePath: 'files/TEST-MP4.mp4',
            Category: '',
<<<<<<< HEAD
            Preview: 'https://www.dochipo.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/08/YouTube-Thumbnail-_-Food-2.png.webp',
            Description: 'Titulo stripe 2',
=======
            Preview: 'https://res.cloudinary.com/cvelasquez/image/upload/v1716557208/F74A1FF2-1616-401F-93D7-76AC71E60EFC_qy3edm.jpg',
            Description: 'Titulín',
>>>>>>> ebe29e8d119cdec7400b750b82b542db511e008d
            Rating: 0,
            RatingQty: 0,
            Duration: 10,
            label: '',
        },{
          ID: 3,
          FileName: 'video1.mp4',
          FileType: 'mp4',
          FileSize: 0,
          FilePath: 'files/TEST-MP4.mp4',
          Category: '',
<<<<<<< HEAD
          Preview: 'https://res.cloudinary.com/cvelasquez/image/upload/v1716557208/F74A1FF2-1616-401F-93D7-76AC71E60EFC_qy3edm.jpg',
          Description: 'Otro título',
=======
          Preview: 'https://res.cloudinary.com/cvelasquez/image/upload/v1716558838/D9E3A8D1-125F-4CB4-9C14-96B407AF6C71_k4yck8.jpg',
          Description: '',
>>>>>>> ebe29e8d119cdec7400b750b82b542db511e008d
          Rating: 3.3,
          RatingQty: 30,
          Duration: 6,
          label: 'test',
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

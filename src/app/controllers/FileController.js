import File from '@models/File';

class FileController {
  async store(req, res) {
    const { originalname: name } = req.file;
    let disk, url, type, size;

    if (process.env.STORAGE_TYPE === 's3') {
      url = req.file.location;
    } else {
      url = `${process.env.APP_URL_FILE}/files/${req.file.filename}`;
    }
    disk = process.env.STORAGE_TYPE;
    type = req.file.mimetype;
    size = req.file.size;
    const file = await File.create({ disk, name, type, size, url });

    return res.status(201).json(file);
  }
}

export default new FileController();

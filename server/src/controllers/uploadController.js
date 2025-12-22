async function getFile(req, res) {
  const bucket = req.app.locals.bucket;
  if (!bucket) return res.status(500).json({ message: 'Storage not ready' });

  const { filename } = req.params;
  try {
    const files = await bucket.find({ filename }).toArray();
    if (!files || files.length === 0) return res.status(404).json({ message: 'File not found' });

    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    const downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.on('error', () => res.status(404).json({ message: 'File not found' }));
    return downloadStream.pipe(res);
  } catch (err) {
    return res.status(500).json({ message: 'Error reading file' });
  }
}

function handleUpload(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  return res.json({
    filename: req.file.filename,
    originalName: req.file.originalname,
    id: req.file.id,
  });
}

module.exports = { getFile, handleUpload };

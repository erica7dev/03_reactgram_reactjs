const Photo = require("../models/Photo");

const mongoose = require("mongoose");

// Subindo foto
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  console.log(req.body);

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  console.log(user.name);

  // Cria foto
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  if (!newPhoto) {
    res.status(422).json({
      errors: ["Houve um erro, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

// Removendo foto
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(mongoose.Types.ObjectId(id));

  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  // Foto pertence ao user?
  if (!photo.userId.equals(reqUser._id)) {
    res
      .status(422)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
    return;
  }

  await Photo.findByIdAndDelete(photo._id);

  res
    .status(200)
    .json({ id: photo._id, message: "Foto excluída com sucesso." });
};

// Pegando todas as fotos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

// Obtenha fotos do user
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

// Foto por id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(mongoose.Types.ObjectId(id));

  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  res.status(200).json(photo);
};

//Update
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let image;

  if (req.file) {
    image = req.file.filename;
  }

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  // foto pertence ao user?
  if (!photo.userId.equals(reqUser._id)) {
    res
      .status(422)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
    return;
  }

  if (title) {
    photo.title = title;
  }

  if (image) {
    photo.image = image;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

// Feature de like
const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  // ver se foto já foi curtida
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ errors: ["Você já curtiu esta foto."] });
    return;
  }

  // curtindo foto pela primeira vez
  photo.likes.push(reqUser._id);

  await photo.save();

  res
    .status(200)
    .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida!" });
};

// add comentário
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  // atualizando comentário
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };

  photo.comments.push(userComment);

  await photo.save();

  res.status(200).json({
    comment: userComment,
    message: "Comentário adicionado com sucesso!",
  });
};

// pesquisar foto por titulo
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
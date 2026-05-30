module.exports = (err) => {
  if (!err) return null;

  if (err.code === 'ER_DUP_ENTRY') {
    return { status: 409, message: 'Already exists' };
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return { status: 409, message: 'Bu yazar/kategori bir kitapta bulunuyor.' };
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return { status: 400, message: 'Kayit mevcut değil' };
  }

  return null;
};

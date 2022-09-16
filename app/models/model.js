module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      firstName: String,
      lastName: String,
      major   : String,
      GPA     : Number,
      graduated: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  const Students = mongoose.model("STEMStudents", schema);
  return Students;
};
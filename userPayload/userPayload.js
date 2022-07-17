module.exports = class UserPayload {
  constructor(model) { 
      this.email = model.email;
      this.id = model._id; 
  }
}

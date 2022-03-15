// DTO - Data Transfer Object

export const makeDto = (model) => ({
  id: model._id,
  email: model.email,
  isActivated: model.isActivated,
});

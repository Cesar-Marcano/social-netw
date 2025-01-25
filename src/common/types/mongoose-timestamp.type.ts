/**
 * Type definition for Mongoose document timestamps.
 *
 * This type represents the `createdAt` and `updatedAt` fields commonly found
 * in Mongoose schemas when using the `timestamps` option. These fields are
 * automatically managed by Mongoose if the `timestamps: true` option is used.
 */
export type MongooseTimestamp = {
  /**
   * The date and time when the document was created.
   * This field is typically set automatically by Mongoose.
   */
  createdAt?: Date;

  /**
   * The date and time when the document was last updated.
   * This field is typically updated automatically by Mongoose on every save.
   */
  updatedAt?: Date;
};

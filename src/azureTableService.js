import { TableClient, AzureNamedKeyCredential, AzureSASCredential } from "@azure/data-tables";
import { v4 as uuidv4 } from 'uuid';

const accountName = "alphateamgenstorage";
const sasToken = "sv=2022-11-02&ss=t&srt=sco&sp=rwdlacu&se=2040-02-27T18:04:05Z&st=2025-02-27T10:04:05Z&spr=https&sig=5%2BXuhHjzTB8ZpPYtwzhUKTQKSCjPM%2B9PltEUVeYT3DE%3D"; // SAS Token
const tableName = "TechRadar";


// Create a Table Client
const credential = new AzureNamedKeyCredential(accountName, sasToken);
const tableClient = new TableClient(
  `https://${accountName}.table.core.windows.net`,
  tableName,
  new AzureSASCredential(sasToken)
);

export const getTechnology = async (rowKey) => {
  try {
    return await tableClient.getEntity("Technology", rowKey);
  } catch (error) {
    if (error.statusCode === 404) {
      return null; // Return null if technology not found
    }
    throw error; // Re-throw other errors
  }
};

export const addTechnology = async (partitionKey, rowKey, name, email) => {
  const entity = {
    partitionKey: "Technology",
    rowKey: uuidv4(),
    name,
    abstract,
    keyPrinciples,
    stage,
    definitionAndScope,
    relevanceAndImpact,
    trendSegment,
    trendSubSegment,
    trendMaturityLevel,
    InternalStatus,
    quadrant,
    ring,
    active,
    moved,
  };
  await tableClient.createEntity(entity);
};

export const addReference = async (technologyId, url, description) => {
  const entity = {
    partitionKey: "Reference",
    rowKey: uuidv4(), // Unique ID for the media reference
    technologyId, // Foreign key linking to the technology
    url,
    description
  };
  await mediaTableClient.createEntity(entity);
};

export const addComment = async (technologyId, user, commentText) => {
  const entity = {
    partitionKey: "Comment",
    rowKey: uuidv4(), // Unique ID for the comment
    technologyId, // Foreign key linking to the technology
    user,
    commentText,
    timestamp: new Date().toISOString()
  };
  await commentsTableClient.createEntity(entity);
};

export const editTechnology = async (rowKey, updatedData) => {
  const entity = {
    partitionKey: "Technology",
    rowKey,
    ...updatedData, // Spread the updated fields
  };
  await tableClient.updateEntity(entity, "Merge"); // Merges changes with existing data
};

export const editReference = async (rowKey, updatedData) => {
  const entity = {
    partitionKey: "Reference",
    rowKey,
    ...updatedData,
  };
  await mediaTableClient.updateEntity(entity, "Merge");
};


export const editComment = async (rowKey, updatedData) => {
  const entity = {
    partitionKey: "Comment",
    rowKey,
    ...updatedData,
  };
  await commentsTableClient.updateEntity(entity, "Merge");
};

export const deleteTechnology = async (rowKey) => {
  await tableClient.deleteEntity("Technology", rowKey);
};

export const deleteReference = async (rowKey) => {
  await mediaTableClient.deleteEntity("Reference", rowKey);
};

export const deleteComment = async (rowKey) => {
  await commentsTableClient.deleteEntity("Comment", rowKey);
};








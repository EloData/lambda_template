import { HandleAddRows } from './functions/addRows/handler';
import { HandleGetAllRows } from './functions/getAllRows/handler';
import { HandleGetPaginatedRows } from './functions/getPaginatedRows/handler';
import { HandleRemoveRows } from './functions/removeRows/handler';

const getPaginatedRows = new HandleGetPaginatedRows().handler;
const getAllRows = new HandleGetAllRows().handler;
const addRows = new HandleAddRows().handler;
const removeRows = new HandleRemoveRows().handler;

export { getPaginatedRows, getAllRows, addRows, removeRows };

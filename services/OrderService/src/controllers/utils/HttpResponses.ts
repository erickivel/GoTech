import { IHttpResponse } from '../ports/IHttpResponse'

export const ok = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (data: any): IHttpResponse => ({
  statusCode: 201,
  body: data
})

export const updated = (data: any): IHttpResponse => ({
  statusCode: 201,
  body: data
})

export const unauthorized = (error: any): IHttpResponse => ({
  statusCode: 401,
  body: error
})

export const forbidden = (error: any): IHttpResponse => ({
  statusCode: 403,
  body: error
})

export const badRequest = (error: any): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: any): IHttpResponse => ({
  statusCode: 500,
  body: error
})
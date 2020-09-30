const ExtendableError = require('es6-error')

class ApplicationError extends ExtendableError {
  constructor(message, status, properties) {
    super(message)

    this.message = message || 'Something went wrong'
    this.status = status || 500
    this.properties = properties || null
  }

  toJSON() {
    return {
      message: this.message,
      properties: this.properties,
      status: this.status,
    }
  }
}

class NotFoundError extends ApplicationError {
  constructor(message, properties) {
    super(message || 'The requested resource is not found', 404, properties)
  }
}

class ParameterError extends ApplicationError {
  constructor(message, properties) {
    super(message || 'Missing or invalid parameters', 400, properties)
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message, properties) {
    super(message || 'Forbidden action', 403, properties)
  }
}

module.exports = {
  ApplicationError,
  NotFoundError,
  ParameterError,
  ForbiddenError,
}

export class ApiError extends Error {
  status: number;
  expose: boolean;

  constructor(status: number, message: string, expose = true) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.expose = expose;
  }
}

export class ServerConfigError extends ApiError {
  constructor(message = "服务端配置缺失，请检查数据库环境变量") {
    super(500, message, false);
    this.name = "ServerConfigError";
  }
}

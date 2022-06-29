interface UseCaseService<ServiceParameters, ServiceResult> {
  execute(parameters: ServiceParameters): Promise<ServiceResult>;
}

export default UseCaseService;

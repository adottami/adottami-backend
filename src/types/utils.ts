// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassType<InstanceType> = new (...parameters: any[]) => InstanceType;

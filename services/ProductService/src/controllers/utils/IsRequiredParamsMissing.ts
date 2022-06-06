export function IsRequiredParamsMissing(receivedParams: any, requiredParams: string[]): string {
  const missingParams: string[] = [];

  requiredParams.forEach(param => {
    if (!Object.keys(receivedParams).includes(param)) {
      missingParams.push(param);
    }

    return false;
  });

  return missingParams.join(', ');
}
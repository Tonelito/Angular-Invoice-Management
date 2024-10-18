export function formatRequestData(requestBody: string): string {
  try {
    const parsedData = JSON.parse(requestBody);

    return Object.entries(parsedData)
      .map(([key, value]) => {
        if (value === null) {
          value = 'Not provided';
        }
        if (key === 'dateOfBirth' && typeof value === 'number') {
          value = new Date(value).toLocaleDateString('en-GB');
        }
        return `${key}: ${value}`;
      })
      .join('\n');
  } catch (error) {
    console.error('Error parsing request body', error);
    return 'Invalid request format';
  }
}

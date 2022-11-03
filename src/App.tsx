import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { IconDatabaseImport } from '@tabler/icons';
import React, { useEffect, useState } from 'react';

/**
 * App Component
 */
const App: React.FC = () => {
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>("");
  const [ successMessage, setSuccessMessage ] = useState<string>("");

  /**
   * Event handler for Run import-button click
   */
  const initiateImport = async () => {
    setLoading(true);

    try {
      const request = await fetch("http://localhost:8082/v1/importProducts", {
        method: "POST"
      });

      const response = await request.json();

      if (request.status === 200) {
        const importCount = request.headers.get("X-TOTAL-COUNT");

        setSuccessMessage(`Successfully imported ${importCount} products! See your dashboards Products page.`)
      }
      
      throw new Error(response.message);
    } catch (e: any) {
      setErrorMessage(`Error happened while importing. ${e.message}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (successMessage) {
      setErrorMessage("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 6000);
    }

    if (errorMessage) {
      setSuccessMessage("");
      setTimeout(() => {
        setErrorMessage("");
      }, 6000);
    }
  }, [ successMessage, errorMessage ]);

  return (
    <Center style={{ width: 400, height: 400, margin: "auto" }}>
      <Stack>
        <Title>Saleor-Akeneo PIM Integration App</Title>
        <Text size="xl">Press "Run Import"-button to import products from Akeneo PIM into Saleor.</Text>
        <Button
          uppercase
          loading={ loading }
          leftIcon={ <IconDatabaseImport size={ 19 }/> }
          radius="md"
          onClick={ initiateImport }
          style={{ width: 400 }}
        >
          Run import
        </Button>
        <Text color="red">{ errorMessage }</Text>
        <Text color="teal">{ successMessage }</Text>
      </Stack>
    </Center>
  );
};

export default App;

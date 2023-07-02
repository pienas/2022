import Head from 'next/head';
import cookie from 'js-cookie';
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import { Select, Input, Button, Link } from '@chakra-ui/react';
import fetcher from '@/utils/fetcher';
import useSWR from 'swr';
import { useState } from 'react';
import { createTransaction, updateStats } from '@/lib/db';
import { useToast } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function ManageAdd() {
  const toast = useToast();
  const authCookie = cookie.get('auth');
  const firestore = firebase.firestore();
  const [value, setValue] = useState('');
  const [select, setSelect] = useState('');
  const [reason, setReason] = useState('');
  const handleChange = (event) => setValue(event.target.value);
  const handleSelectChange = (event) => setSelect(event.target.value);
  const handleReasonChange = (event) => setReason(event.target.value);
  const router = useRouter();
  const [user, setUser] = useState('');
  if (typeof window !== 'undefined') {
    if (authCookie !== undefined) {
      const ref = firestore.collection('users').doc(authCookie);
      ref.get().then(async (doc) => {
        if (doc.exists) {
          if (!doc.data().admin) router.push('/');
          else setUser(doc.data().name);
        } else {
          router.push('/');
          cookie.remove('auth');
        }
      });
    } else {
      router.push('/');
    }
  }
  const { data } = useSWR('/api/stats', fetcher);
  if (!data) {
    return <div>Kraunama...</div>;
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      parseInt(value) < 0 ||
      parseInt(value) === 0 ||
      value === undefined ||
      value === null ||
      value.length === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas taškų skaičius',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (select === undefined || select === null || select.length === 0) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas žaidėjas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (reason === undefined || reason === null || reason.length === 0) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkama priežastis',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else {
      const newValue = {
        name: select,
        total:
          data.results.find((e) => e.name === select).total + parseInt(value)
      };
      const newTransactionValue = {
        to: select,
        by: user,
        game: reason,
        gameType: 'admin',
        amount: parseInt(value),
        amountAfterHouseEdge: parseInt(value)
      };
      await createTransaction(newTransactionValue);
      await updateStats(newValue).then(() => {
        toast({
          title: 'Atnaujinta',
          description: 'Taškai pridėti',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        setValue('');
      });
    }
  };
  return (
    <div>
      <Head>
        <title>Pridėti - 2022</title>
      </Head>
      <main>
        <Select
          mb={8}
          placeholder="Kam pridėti taškų?"
          onChange={handleSelectChange}
        >
          {data.results.map((stat) => (
            <option value={stat.name} key={stat.name}>
              {stat.name}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          placeholder="Kiek taškų pridėti?"
          value={value}
          mb={8}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Priežastis"
          value={reason}
          onChange={handleReasonChange}
        />
        <Button mt={8} onClick={onSubmit}>
          Pridėti
        </Button>
        <br />
        <NextLink href="/manage" passHref>
          <Link color="blue.500" fontWeight="medium">
            Grįžti į valdymą
          </Link>
        </NextLink>
        <br />
        <NextLink href="/" passHref>
          <Link color="blue.500" fontWeight="medium">
            Grįžti į statistiką
          </Link>
        </NextLink>
      </main>
    </div>
  );
}

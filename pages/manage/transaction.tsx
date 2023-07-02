import Head from 'next/head';
import cookie from 'js-cookie';
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import {
  Select,
  Input,
  Button,
  Link,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
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
  const { data: stats } = useSWR('/api/stats', fetcher);
  const { data: games } = useSWR('/api/games', fetcher);
  const [amount, setAmount] = useState('');
  const [winner, setWinner] = useState('');
  const [player, setPlayer] = useState('');
  const [firstPlace, setFirstPlace] = useState('');
  const [secondPlace, setSecondPlace] = useState('');
  const [thirdPlace, setThirdPlace] = useState('');
  const [isWinner, setIsWinner] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [playersCount, setPlayersCount] = useState(0);
  const [impostersCount, setImpostersCount] = useState(0);
  const [crewmatesCount, setCrewmatesCount] = useState(0);
  const [imposters, setImposters] = useState([]);
  const [crewmates, setCrewmates] = useState([]);
  const [imposter, setImposter] = useState([]);
  const [crewmate, setCrewmate] = useState([]);
  const [amongusWinners, setAmongusWinners] = useState('');
  const [loser, setLoser] = useState('');
  const [game, setGame] = useState({
    type: '',
    houseEdge: 0,
    name: '',
    prize: 0
  });
  if (!stats || !games) {
    return <div>Kraunama...</div>;
  }
  const handleAmountChange = (event) => setAmount(event.target.value);
  const handleLoserChange = (event) => setLoser(event.target.value);
  const handleWinnerChange = (event) => setWinner(event.target.value);
  const handlePlayerChange = (event) => setPlayer(event.target.value);
  const handleFirstPlaceChange = (event) => setFirstPlace(event.target.value);
  const handleSecondPlaceChange = (event) => setSecondPlace(event.target.value);
  const handleThirdPlaceChange = (event) => setThirdPlace(event.target.value);
  const handleMultiplierChange = (value) => setMultiplier(value);
  const handlePlayersCountChange = (value) => {
    setPlayersCount(parseInt(value));
    setCrewmatesCount(parseInt(value) - impostersCount);
    const tempCrewmates = [];
    for (var i = 0; i < parseInt(value) - impostersCount; i++) {
      tempCrewmates.push(1);
      setCrewmates(tempCrewmates);
    }
  };
  const handleImpostersCountChange = (value) => {
    setImpostersCount(parseInt(value));
    setCrewmatesCount(playersCount - parseInt(value));
    const tempImposters = [];
    const tempCrewmates = [];
    for (var i = 0; i < parseInt(value); i++) {
      tempImposters.push(1);
      setImposters(tempImposters);
    }
    for (var i = 0; i < playersCount - parseInt(value); i++) {
      tempCrewmates.push(1);
      setCrewmates(tempCrewmates);
    }
  };
  const handleAmongusWinnersChange = (event) =>
    setAmongusWinners(event.target.value);
  const handleImposterChange = (event, i) => {
    const allImposters = imposter;
    allImposters[i] = event.target.value;
    setImposter(allImposters);
  };
  const handleCrewmateChange = (event, i) => {
    const allCrewmates = crewmate;
    allCrewmates[i] = event.target.value;
    setCrewmate(allCrewmates);
  };
  const handleIsWinnerChange = (event) =>
    setIsWinner(event.target.value === 'true' ? true : false);
  const handleGameChange = (event) =>
    setGame(
      games.results.find(({ name }) => name === event.target.value) ===
        undefined
        ? { type: '', houseEdge: 0, name: '' }
        : games.results.find(({ name }) => name === event.target.value)
    );
  const on1v1Submit = async (e) => {
    e.preventDefault();
    if (
      parseInt(amount) < 0 ||
      parseInt(amount) === 0 ||
      amount === undefined ||
      amount === null ||
      amount.length === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas taškų skaičius',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (loser === undefined || loser === null || loser.length === 0) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas pralaimėtojas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (winner === undefined || winner === null || winner.length === 0) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas laimėtojas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (winner === loser) {
      toast({
        title: 'Nepavyko',
        description: 'Pralaimėtojas negali būti laimėtojas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else {
      const newWinnerValue = {
        name: winner,
        total:
          stats.results.find((e) => e.name === winner).total +
          parseInt(amount) * (1 - game.houseEdge / 100)
      };
      const newLoserValue = {
        name: loser,
        total:
          stats.results.find((e) => e.name === loser).total - parseInt(amount)
      };
      const newTransactionValue = {
        from: loser,
        to: winner,
        by: user,
        game: game.name,
        gameType: '1v1',
        amount: parseInt(amount),
        amountAfterHouseEdge: parseInt(amount) * (1 - game.houseEdge / 100)
      };
      await updateStats(newWinnerValue);
      await updateStats(newLoserValue);
      await createTransaction(newTransactionValue);
      toast({
        title: 'Atnaujinta',
        description: 'Taškai sėkmingai pervesti',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      setAmount('');
    }
  };
  const onSoloSubmit = async (e) => {
    e.preventDefault();
    if (
      parseInt(amount) < 0 ||
      parseInt(amount) === 0 ||
      amount === undefined ||
      amount === null ||
      amount.length === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas taškų skaičius',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (player === undefined || player === null || player.length === 0) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas žaidėjas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else {
      const newPlayerValue = {
        name: player,
        total: isWinner
          ? stats.results.find((e) => e.name === player).total +
            parseInt(amount) * (1 - game.houseEdge / 100)
          : stats.results.find((e) => e.name === player).total -
            parseInt(amount)
      };
      const newTransactionValue = {
        from: isWinner ? '' : player,
        to: isWinner ? player : '',
        by: user,
        game: game.name,
        gameType: 'solo',
        amount: parseInt(amount),
        amountAfterHouseEdge: parseInt(amount) * (1 - game.houseEdge / 100)
      };
      await updateStats(newPlayerValue);
      await createTransaction(newTransactionValue);
      toast({
        title: 'Atnaujinta',
        description: `Taškai sėkmingai ${isWinner ? 'pridėti' : 'atimti'}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      setAmount('');
    }
  };
  const onSoloCrashSubmit = async (e) => {
    e.preventDefault();
    if (
      parseInt(amount) < 0 ||
      parseInt(amount) === 0 ||
      amount === undefined ||
      amount === null ||
      amount.length === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas taškų skaičius',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (player === undefined || player === null || player.length === 0) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas žaidėjas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else {
      const newPlayerValue = {
        name: player,
        total: isWinner
          ? stats.results.find((e) => e.name === player).total +
            parseInt(amount) * multiplier
          : stats.results.find((e) => e.name === player).total -
            parseInt(amount)
      };
      const newTransactionValue = {
        from: isWinner ? '' : player,
        to: isWinner ? player : '',
        by: user,
        game: game.name,
        gameType: 'solo',
        amount: isWinner ? parseInt(amount) * multiplier : parseInt(amount),
        amountAfterHouseEdge: isWinner
          ? parseInt(amount) * multiplier
          : parseInt(amount)
      };
      await updateStats(newPlayerValue);
      await createTransaction(newTransactionValue);
      toast({
        title: 'Atnaujinta',
        description: `Taškai sėkmingai ${isWinner ? 'pridėti' : 'atimti'}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      setAmount('');
      setMultiplier(1);
    }
  };
  const onGroupSubmit = async (e) => {
    e.preventDefault();
    if (
      firstPlace === undefined ||
      firstPlace === null ||
      firstPlace.length === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas 1 vietos laimėtojas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (
      secondPlace === undefined ||
      secondPlace === null ||
      secondPlace.length === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas 2 vietos laimėtojas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (
      thirdPlace === undefined ||
      thirdPlace === null ||
      thirdPlace.length === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas 3 vietos laimėtojas',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else {
      const newFirstPlaceValue = {
        name: firstPlace,
        total:
          stats.results.find((e) => e.name === firstPlace).total +
          game.prize * 0.5
      };
      const newSecondPlaceValue = {
        name: secondPlace,
        total:
          stats.results.find((e) => e.name === secondPlace).total +
          game.prize * 0.35
      };
      const newThirdPlaceValue = {
        name: thirdPlace,
        total:
          stats.results.find((e) => e.name === thirdPlace).total +
          game.prize * 0.15
      };
      const newFirstPlaceTransactionValue = {
        to: firstPlace,
        by: user,
        game: game.name,
        gameType: 'group',
        place: 1,
        amount: game.prize * 0.5,
        amountAfterHouseEdge: game.prize * 0.5
      };
      const newSecondPlaceTransactionValue = {
        to: secondPlace,
        by: user,
        game: game.name,
        gameType: 'group',
        place: 2,
        amount: game.prize * 0.35,
        amountAfterHouseEdge: game.prize * 0.35
      };
      const newThirdPlaceTransactionValue = {
        to: thirdPlace,
        by: user,
        game: game.name,
        gameType: 'group',
        place: 3,
        amount: game.prize * 0.15,
        amountAfterHouseEdge: game.prize * 0.15
      };
      await updateStats(newFirstPlaceValue);
      await updateStats(newSecondPlaceValue);
      await updateStats(newThirdPlaceValue);
      await createTransaction(newFirstPlaceTransactionValue);
      await createTransaction(newSecondPlaceTransactionValue);
      await createTransaction(newThirdPlaceTransactionValue);
      toast({
        title: 'Atnaujinta',
        description: 'Taškai sėkmingai išdalinti',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
  };
  const onAmongusSubmit = async (e) => {
    e.preventDefault();
    if (
      playersCount === undefined ||
      playersCount === null ||
      playersCount === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas žaidėjų skaičius',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (
      impostersCount === undefined ||
      impostersCount === null ||
      impostersCount === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkamas apsimetėlių skaičius',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (
      amongusWinners === undefined ||
      amongusWinners === null ||
      amongusWinners.length === 0
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkami laimėtojai',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (
      amongusWinners === 'imposters' &&
      imposter.length !== 0 &&
      Object.values(imposter).length !== imposters.length
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkami apsimetėliai',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (
      amongusWinners === 'crewmates' &&
      crewmate.length !== 0 &&
      Object.values(crewmate).length !== crewmates.length
    ) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkami įgulos nariai',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (amongusWinners === 'imposters' && imposter.length === 0) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkami apsimetėliai',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else if (amongusWinners === 'crewmates' && crewmate.length === 0) {
      toast({
        title: 'Nepavyko',
        description: 'Netinkami įgulos nariai',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else {
      if (amongusWinners === 'imposters') {
        imposters.forEach(async (_, i) => {
          const newWinnerValue = {
            name: imposter[i],
            total:
              stats.results.find((e) => e.name === imposter[i]).total +
              game.prize / impostersCount
          };
          const newWinnerTransactionValue = {
            to: imposter[i],
            by: user,
            game: game.name,
            gameType: 'group',
            amount: game.prize / impostersCount,
            amountAfterHouseEdge: game.prize / impostersCount
          };
          await updateStats(newWinnerValue);
          await createTransaction(newWinnerTransactionValue);
        });
        toast({
          title: 'Atnaujinta',
          description: 'Taškai sėkmingai išdalinti',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        setPlayersCount(0);
        setImpostersCount(0);
      } else if (amongusWinners === 'crewmates') {
        crewmates.forEach(async (_, i) => {
          const newWinnerValue = {
            name: crewmate[i],
            total:
              stats.results.find((e) => e.name === crewmate[i]).total +
              game.prize / crewmatesCount
          };
          const newWinnerTransactionValue = {
            to: crewmate[i],
            by: user,
            game: game.name,
            gameType: 'group',
            amount: game.prize / crewmatesCount,
            amountAfterHouseEdge: game.prize / crewmatesCount
          };
          await updateStats(newWinnerValue);
          await createTransaction(newWinnerTransactionValue);
        });
        toast({
          title: 'Atnaujinta',
          description: 'Taškai sėkmingai išdalinti',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        setPlayersCount(0);
        setImpostersCount(0);
      }
    }
  };
  return (
    <div>
      <Head>
        <title>Pervedimas - 2022</title>
      </Head>
      <main>
        <Select mb={8} placeholder="Žaidimas" onChange={handleGameChange}>
          {games.results.map((game) => (
            <option value={game.name} key={game.name}>
              {game.name}
            </option>
          ))}
        </Select>
        {game.type === '1v1' && (
          <>
            <Select
              mb={8}
              placeholder="Pralaimėtojas"
              onChange={handleLoserChange}
            >
              {stats.results.map((stat) => (
                <option value={stat.name} key={stat.name}>
                  {stat.name}
                </option>
              ))}
            </Select>
            <Select
              mb={8}
              placeholder="Laimėtojas"
              onChange={handleWinnerChange}
            >
              {stats.results.map((stat) => (
                <option value={stat.name} key={stat.name}>
                  {stat.name}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Statymo suma"
              value={amount}
              onChange={handleAmountChange}
            />
            <Button mt={8} onClick={on1v1Submit}>
              Pervesti taškus
            </Button>
          </>
        )}
        {game.type === 'solo' && game.name !== 'Crash' && (
          <>
            <Select mb={8} placeholder="Žaidėjas" onChange={handlePlayerChange}>
              {stats.results.map((stat) => (
                <option value={stat.name} key={stat.name}>
                  {stat.name}
                </option>
              ))}
            </Select>
            <Select
              mb={8}
              placeholder="Ar laimėjo?"
              onChange={handleIsWinnerChange}
            >
              <option value="true">Taip</option>
              <option value="false">Ne</option>
            </Select>
            <Input
              type="number"
              placeholder="Statymo suma"
              value={amount}
              onChange={handleAmountChange}
            />
            <Button mt={8} onClick={onSoloSubmit}>
              {isWinner ? 'Pridėti taškus' : 'Atimti taškus'}
            </Button>
          </>
        )}
        {game.type === 'solo' && game.name === 'Crash' && (
          <>
            <Select mb={8} placeholder="Žaidėjas" onChange={handlePlayerChange}>
              {stats.results.map((stat) => (
                <option value={stat.name} key={stat.name}>
                  {stat.name}
                </option>
              ))}
            </Select>
            <Select
              mb={8}
              placeholder="Ar laimėjo?"
              onChange={handleIsWinnerChange}
            >
              <option value="true">Taip</option>
              <option value="false">Ne</option>
            </Select>
            <Input
              type="number"
              mb={8}
              placeholder="Statymo suma"
              value={amount}
              onChange={handleAmountChange}
            />
            <NumberInput
              precision={2}
              step={0.01}
              placeholder="Koeficientas"
              value={multiplier}
              onChange={handleMultiplierChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button mt={8} onClick={onSoloCrashSubmit}>
              {isWinner ? 'Pridėti taškus' : 'Atimti taškus'}
            </Button>
          </>
        )}
        {game.type === 'group' && game.name !== 'Among us' && (
          <>
            <Select
              mb={8}
              placeholder="1 vieta"
              onChange={handleFirstPlaceChange}
            >
              {stats.results.map((stat) => (
                <option value={stat.name} key={stat.name}>
                  {stat.name}
                </option>
              ))}
            </Select>
            <Select
              mb={8}
              placeholder="2 vieta"
              onChange={handleSecondPlaceChange}
            >
              {stats.results.map((stat) => (
                <option value={stat.name} key={stat.name}>
                  {stat.name}
                </option>
              ))}
            </Select>
            <Select
              mb={8}
              placeholder="3 vieta"
              onChange={handleThirdPlaceChange}
            >
              {stats.results.map((stat) => (
                <option value={stat.name} key={stat.name}>
                  {stat.name}
                </option>
              ))}
            </Select>
            <Button mt={8} onClick={onGroupSubmit}>
              Dalinti taškus
            </Button>
          </>
        )}
        {game.type === 'group' && game.name === 'Among us' && (
          <>
            <Text fontSize="12px" color="gray.600">
              Visų žaidėjų skaičius
            </Text>
            <NumberInput
              mb={8}
              step={1}
              placeholder="Visų žaidėjų skaičius"
              value={playersCount}
              onChange={handlePlayersCountChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" color="gray.600">
              Apsimetėlių skaičius
            </Text>
            <NumberInput
              mb={8}
              step={1}
              placeholder="Apsimetėlių skaičius"
              value={impostersCount}
              onChange={handleImpostersCountChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Select
              mb={8}
              placeholder="Laimėtojai"
              onChange={handleAmongusWinnersChange}
            >
              <option value="imposters">Apsimetėliai</option>
              <option value="crewmates">Įgulos nariai</option>
            </Select>
            {amongusWinners === 'imposters' ? (
              imposters.map((_, i) => (
                <Select
                  mb={8}
                  key={i}
                  placeholder={`Apsimetėlis ${i + 1}`}
                  onChange={(event) => handleImposterChange(event, i)}
                >
                  {stats.results.map((stat) => (
                    <option value={stat.name} key={stat.name}>
                      {stat.name}
                    </option>
                  ))}
                </Select>
              ))
            ) : (
              <></>
            )}
            {amongusWinners === 'crewmates' &&
              crewmates.map((_, i) => (
                <Select
                  mb={8}
                  key={i}
                  placeholder={`Įgulos narys ${i + 1}`}
                  onChange={(event) => handleCrewmateChange(event, i)}
                >
                  {stats.results.map((stat) => (
                    <option value={stat.name} key={stat.name}>
                      {stat.name}
                    </option>
                  ))}
                </Select>
              ))}
            <Button mt={8} onClick={onAmongusSubmit}>
              Dalinti taškus
            </Button>
          </>
        )}
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

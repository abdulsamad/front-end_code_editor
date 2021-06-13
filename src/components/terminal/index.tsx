import { FC, useEffect, useRef, useState } from 'react';
import { XTerm } from 'xterm-for-react';
import 'xterm/css/xterm.css';

import { useAppContext } from '../../context';

import TerminalContainer from './Terminal';
import commandOuputs from './commands';

interface Props {
  id: string;
}

const Terminal: FC<Props> = ({ id }) => {
  const { filesList, addFile, removeFile } = useAppContext();
  const [terminalText, setTerminalText] = useState('');
  const xTermRef = useRef<XTerm | null>(null);
  const terminalHostname = `$root@${document.domain}~`;

  useEffect(() => {
    xTermRef.current?.terminal.writeln('Enter "help" to see the list of supported commands');
    xTermRef.current?.terminal.write(terminalHostname);
  }, [terminalHostname]);

  const onData = (data: any) => {
    const xterm = xTermRef.current;
    const code = data.charCodeAt(0);
    const touchRegex = new RegExp('(touch\\s[a-zA-Z]{4,50}).(html|htm|css|js)');
    const rmRegex = new RegExp('(rm\\s[a-zA-Z]{4,50}).(html|htm|css|js)');

    if (xterm === null || terminalText.length < 0) return;

    //  clear command
    if (terminalText === 'clear' || terminalText === 'cls') {
      xterm.terminal.reset();
      setTerminalText('');
      xterm.terminal.write(terminalHostname);
      return false;
    }

    // touch Command
    else if (touchRegex.test(terminalText)) {
      let extension = terminalText.toLowerCase().split('.').pop() as string;
      // Because js === javascript in Monaco
      extension = extension === 'js' ? 'javascript' : extension;

      addFile({ name: terminalText.slice(6), language: extension, value: '' });
      setTerminalText('');
      xterm.terminal.write(`\r\n\r${terminalHostname}`);
      return false;
    }

    // rm command
    else if (rmRegex.test(terminalText)) {
      removeFile(terminalText.slice(3));
      setTerminalText('');
      xterm.terminal.write(terminalHostname);
      return false;
    }

    switch (code) {
      case 12:
        // CTRL + L (Clear Terminal)
        xterm.terminal.reset();
        setTerminalText('');
        xterm.terminal.write(terminalHostname);
        break;

      case 13:
        // Enter key
        commandOuputs(terminalText, filesList).then((output) => {
          xterm.terminal.write(`\r\n${output}\r\n`);
          xterm.terminal.write(terminalHostname);
          setTerminalText('');
        });

        break;

      case 127:
        // Backspace
        if (terminalText) {
          xterm.terminal.write('\x1b[D');
          setTerminalText((prevState) => prevState.substring(0, prevState.length - 1));
        }
        break;

      default:
        // General keys
        xterm.terminal.write(data);
        setTerminalText((prevState) => prevState + data);
    }
  };

  return (
    <TerminalContainer id={id}>
      <XTerm
        ref={xTermRef}
        onData={onData}
        options={{
          windowOptions: { fullscreenWin: true },
          theme: { background: '#131313', cursor: '#00FF00', foreground: '#00FF00' },
        }}
      />
    </TerminalContainer>
  );
};

export default Terminal;

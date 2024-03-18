import React, { useState } from 'react';
import { SimplePage } from '../SimplePage';
import { Login } from './Actions/Login';
import Signup from './Actions/Signup';

enum Actions {
  LOGIN,
  REGISTER,
}

export function SignupPage() {
  const [action, setAction] = useState();

  return (
    <SimplePage>
      <div className="flex-center bg-green-300">
        <Signup></Signup>
      </div>
    </SimplePage>
  );
}

import React, { useState } from 'react';
import { SimplePage } from '../SimplePage';
import { Login } from './Actions/Login';
import Signup from './Actions/Signup';
import SignupUser from './Actions/SignupUser';

enum Actions {
  LOGIN,
  REGISTER,
}

export function SignupUserPage() {
  const [action, setAction] = useState();

  return (
    <SimplePage>
      <div className="flex-center bg-green-300">
        <SignupUser></SignupUser>
      </div>
    </SimplePage>
  );
}

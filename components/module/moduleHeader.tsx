import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

type TModuleHeaderProps = {
  name: string,
}

export function ModuleHeader({ name } : TModuleHeaderProps) {
  const { data: session } = useSession();

  return (
    <div className={'module-header'}>
      <div className={'module-heading'}>
        <div className={'module-heading__name'}>
          {name}
        </div>
      </div>
    </div>
  );
}


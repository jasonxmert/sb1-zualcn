import React, { useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Clock, Globe, DollarSign, MapPin, Flag } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import clsx from 'clsx';

interface Location {
  name: string;
  country: string;
  postcode: string;
  coordinates: [number, number];
  timezone: string;
  currency: string;
  countryCode: string;
}

interface MapPopupProps {
  location: Location;
  position: { x: number; y: number };
  onClose: () => void;
}

export function MapPopup({ location, position, onClose }: MapPopupProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = formatInTimeZone(currentTime, location.timezone, 'HH:mm:ss');

  return (
    <Popover.Root defaultOpen>
      <Popover.Anchor style={{ position: 'absolute', left: position.x, top: position.y }} />
      <Popover.Portal>
        <Popover.Content
          className={clsx(
            "bg-white rounded-lg shadow-lg p-4 w-80",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
          sideOffset={5}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-500">{location.country}</p>
                <p className="text-sm text-gray-500">{location.postcode}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{formattedTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{location.currency}</span>
              </div>

              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-gray-400" />
                <span className="text-sm">.{location.countryCode.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <Popover.Close
            className="absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Popover.Close>

          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
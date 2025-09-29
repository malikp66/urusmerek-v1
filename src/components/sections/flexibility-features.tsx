"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Search, FileText, FolderKanban } from 'lucide-react';

const ToggleFeature = ({
  icon: Icon,
  label,
  checked,
  onToggle,
}: {
  icon: React.ElementType;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
    <div className="flex items-center">
      <Icon className={`h-5 w-5 transition-colors ${checked ? 'text-primary' : 'text-gray-500'}`} />
      <span className="ml-3 font-medium text-gray-800">{label}</span>
      </div>
    <Switch
      checked={checked}
      onCheckedChange={onToggle}
      id={label.replace(/\s+/g, '-').toLowerCase()}
      aria-label={label}
    />
  </div>
);

const FlexibilityFeatures = () => {
    const [toggles, setToggles] = useState({
        search: true,
        filing: false,
        management: true,
    });

    const handleToggle = (key: keyof typeof toggles) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <section className="bg-white py-20 lg:py-24">
            <div className="container">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Everything your team is looking for
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                        Our platform's exceptional flexibility can handle any type of trademark service. We are constantly innovating to provide the best solutions.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-8">
                        <h3 className="text-2xl font-semibold text-gray-900">Multiple Service Types</h3>
                        <p className="mt-2 text-base text-gray-600">
                            Instantly switch between 15+ views including list, board, gantt, and more to manage your work.
                        </p>
                        <div className="mt-8">
                            <Image
                                src="https://clickup.com/assets/home-test/view-work-your-way-v4.png"
                                alt="Visual representation of different service types"
                                width={508}
                                height={287}
                                className="w-full rounded-lg object-cover"
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-8">
                        <h3 className="text-2xl font-semibold text-gray-900">Custom Packages</h3>
                        <p className="mt-2 text-base text-gray-600">
                            Configuring our services for different needs is as easy as flipping a switch.
                        </p>
                        <div className="mt-8 space-y-4">
                            <ToggleFeature
                                icon={Search}
                                label="Comprehensive Search"
                                checked={toggles.search}
                                onToggle={() => handleToggle('search')}
                            />
                            <ToggleFeature
                                icon={FileText}
                                label="Filing Assistance"
                                checked={toggles.filing}
                                onToggle={() => handleToggle('filing')}
                            />
                            <ToggleFeature
                                icon={FolderKanban}
                                label="Portfolio Management"
                                checked={toggles.management}
                                onToggle={() => handleToggle('management')}
                            />
                        </div>
                    </div>

                    <div className="relative rounded-xl bg-light-red p-8 md:p-12 lg:col-span-2">
                        <div className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-16">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-semibold text-gray-900">Integration with Legal Systems</h3>
                                <p className="mt-2 text-base text-gray-600">
                                    Easily integrates with the legal systems and databases you already use.
                                </p>
                                <div className="mt-8 flex justify-center md:justify-start">
                                    <Image
                                        src="https://images.ctfassets.net/w8fc6tgspyjz/5eW6fJb73nNo4cjPCd45gT/737151fe3c8828de0aa775444040cd7e/clickup-integrations.svg"
                                        alt="Integration with legal systems"
                                        width={254}
                                        height={121}
                                        className="h-auto"
                                    />
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-semibold text-gray-900">Scalable Solutions</h3>
                                <p className="mt-2 text-base text-gray-600">
                                    Our scalable services eliminate the need for multiple providers, saving you time and money.
                                </p>
                                <div className="mt-8 flex justify-center md:justify-start">
                                    <Image
                                        src="https://images.ctfassets.net/w8fc6tgspyjz/4VWndoJsrVy4tMXAQWuUoP/de0a65d4385b8fcc51cdd217b537ac24/clickup-integration-replaces.svg"
                                        alt="Scalable solutions for businesses"
                                        width={252}
                                        height={113}
                                        className="h-auto"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="hidden h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-gray-200 bg-white md:flex">
                                <span className="text-xs font-bold uppercase text-gray-500">OR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlexibilityFeatures;
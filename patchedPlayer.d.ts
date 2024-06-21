import { k as Attributable } from './scopes-eb5984a4.js';
export { A as Attribute, b as AttributeChange, e as AttributeInput, c as AttributeOptions, d as AttributeUpdate, a as Attributes, C as Constructor, J as Json, i as JsonArray, j as JsonValue, S as ScopeConstructor, f as ScopeIdent, g as ScopeUpdate, h as SharedScope } from './scopes-eb5984a4.js';
import { W as WithChildren, C as ConsentProps, P as PlayerCreateProps } from './helpers-3dc821e8.js';
export { S as Scope, a as Scopes } from './scopes-b6add333.js';
import { c as StepTick } from './provider-4150a447.js';
export { S as Step, b as StepChange, d as StepUpdate, a as Steps } from './provider-4150a447.js';
import { G as Game, P as Player, R as Round, S as Stage } from './classic-b98e0678.js';
export { C as Context, e as EmpiricaClassicKinds, a as PlayerGame, b as PlayerRound, c as PlayerStage } from './classic-b98e0678.js';
import React, { ChangeEventHandler } from 'react';
import '@empirica/tajriba';
import 'rxjs';

declare type StepsFunc = (props: {
    game?: Game | null;
    player?: Player | null;
}) => React.ElementType[] | undefined;
declare type StepsProps = WithChildren<{
    steps: React.ElementType[] | StepsFunc;
    progressKey: string;
    doneKey: string;
    object?: Attributable;
}>;

interface EmpiricaContextProps {
    children: React.ReactNode;
    noGames?: React.ElementType;
    consent?: React.ElementType<ConsentProps>;
    playerCreate?: React.ElementType<PlayerCreateProps>;
    lobby?: React.ElementType;
    introSteps?: React.ElementType[] | StepsFunc;
    exitSteps?: React.ElementType[] | StepsFunc;
    finished?: React.ElementType;
    loading?: React.ElementType;
    connecting?: React.ElementType;
    unmanagedGame?: boolean;
    unmanagedAssignment?: boolean;
    disableConsent?: boolean;
    disableNoGames?: boolean;
    disableURLParamsCapture?: boolean;
}
declare function EmpiricaContext({ noGames: NoGamesComp, consent: ConsentComp, playerCreate: PlayerCreateForm, introSteps, lobby, exitSteps, finished, loading: LoadingComp, connecting: ConnectingComp, unmanagedGame, unmanagedAssignment, disableConsent, disableNoGames, disableURLParamsCapture, children, }: EmpiricaContextProps): JSX.Element;

declare function Lobby(): JSX.Element;

declare function Quiz({ next }: {
    next: () => void;
}): JSX.Element;

interface SliderProps {
    value: number;
    onChange: ChangeEventHandler<HTMLInputElement>;
    min?: number;
    max?: number;
    stepSize?: number;
    disabled?: boolean;
}
declare function Slider({ value, onChange, min, max, stepSize, disabled, }: SliderProps): JSX.Element;

declare type ChatProps = WithChildren<{
    scope: Attributable;
    attribute: string;
    loading?: React.ElementType;
}>;
declare function Chat({ scope, attribute, loading: LoadingComp, }: ChatProps): JSX.Element;

declare function Sweeper(): JSX.Element | null;

declare function usePlayer(): Player | null | undefined;
declare function useGame(): Game | null | undefined;
declare function useRound(): Round | null | undefined;
declare function useStage(): Stage | null | undefined;
declare function useStageTimer(): StepTick | undefined;
declare function usePlayers(): Player[] | undefined;
declare function usePartModeCtx<M>(): M | undefined;
declare function usePartModeCtxKey<M, K extends keyof M, R>(name: K): R | undefined;

export { Attributable, Chat, ChatProps, ConsentProps, EmpiricaContext, EmpiricaContextProps, Game, Lobby, Player, PlayerCreateProps, Quiz, Round, Slider, SliderProps, Stage, StepTick, StepsFunc, StepsProps, Sweeper, WithChildren, useGame, usePartModeCtx, usePartModeCtxKey, usePlayer, usePlayers, useRound, useStage, useStageTimer };
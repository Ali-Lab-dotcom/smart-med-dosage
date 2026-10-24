import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Baby,
  Calculator,
  CheckCircle2,
  Droplets,
  Info,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from 'lucide-react';
import { medicines, type Medicine } from '@/data/medicines';
import { calculateDose, round, type DoseResult } from '@/utils/calc';

type Step = 1 | 2 | 3;

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [weight, setWeight] = useState<string>('');
  const [medicineId, setMedicineId] = useState<string>('');

  const weightNum = parseFloat(weight.replace(',', '.'));
  const weightValid = !isNaN(weightNum) && weightNum > 0 && weightNum < 300;

  const selectedMedicine = useMemo(
    () => medicines.find((m) => m.id === medicineId) ?? null,
    [medicineId],
  );

  const result: DoseResult | null = useMemo(() => {
    if (!selectedMedicine || !weightValid) return null;
    return calculateDose(selectedMedicine, weightNum);
  }, [selectedMedicine, weightValid, weightNum]);

  const canProceed = (s: Step): boolean => {
    if (s === 1) return weightValid;
    if (s === 2) return !!selectedMedicine;
    return true;
  };

  const reset = () => {
    setStep(1);
    setWeight('');
    setMedicineId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50/40 text-slate-800">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-200">
            <Stethoscope className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Smart Med Dosage Calculator
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Калькулятор дозировок для врачей-педиатров
          </p>
        </header>

        {/* Stepper */}
        <Stepper step={step} />

        {/* Card */}
        <main className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          {step === 1 && (
            <StepWeight
              weight={weight}
              setWeight={setWeight}
              weightValid={weightValid}
            />
          )}
          {step === 2 && (
            <StepMedicine
              medicineId={medicineId}
              setMedicineId={setMedicineId}
              selectedMedicine={selectedMedicine}
            />
          )}
          {step === 3 && selectedMedicine && result && (
            <StepResult
              medicine={selectedMedicine}
              weightNum={weightNum}
              result={result}
            />
          )}
          {step === 3 && (!selectedMedicine || !result) && (
            <div className="py-10 text-center text-slate-400">
              Недостаточно данных. Вернитесь назад.
            </div>
          )}
        </main>

        {/* Nav buttons */}
        <nav className="mt-5 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" /> Назад
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              onClick={() => canProceed(step) && setStep((s) => ((s + 1) as Step))}
              disabled={!canProceed(step)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {step === 1 ? 'Далее' : 'Рассчитать'}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Новый расчёт
            </button>
          )}
        </nav>

        {/* Disclaimer */}
        <footer className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Educational tool. Always double-check clinically.</span>
        </footer>
      </div>
    </div>
  );
}

/* ---------------- Stepper ---------------- */

function Stepper({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: 'Пациент', icon: Baby },
    { n: 2, label: 'Лекарство', icon: Pill },
    { n: 3, label: 'Результат', icon: Calculator },
  ] as const;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((s, i) => {
        const active = step === s.n;
        const done = step > s.n;
        return (
          <div key={s.n} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : active
                      ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-200'
                      : 'border-slate-200 bg-white text-slate-300',
                ].join(' ')}
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <s.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={[
                  'text-[11px] font-medium transition sm:text-xs',
                  active ? 'text-sky-600' : done ? 'text-emerald-600' : 'text-slate-400',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={[
                  'h-0.5 w-8 rounded-full transition-all duration-300 sm:w-16',
                  step > s.n ? 'bg-emerald-400' : 'bg-slate-200',
                ].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Step 1: Weight ---------------- */

function StepWeight({
  weight,
  setWeight,
  weightValid,
}: {
  weight: string;
  setWeight: (v: string) => void;
  weightValid: boolean;
}) {
  return (
    <div className="animate-fadeIn">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
          <Baby className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Данные пациента</h2>
          <p className="text-sm text-slate-500">Введите вес ребёнка</p>
        </div>
      </div>

      <label htmlFor="weight" className="mb-1.5 block text-sm font-medium text-slate-600">
        Вес (кг)
      </label>
      <div className="relative">
        <input
          id="weight"
          type="text"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="например, 12.5"
          className={[
            'w-full rounded-xl border bg-slate-50 px-4 py-3 pr-12 text-lg font-medium text-slate-900 outline-none transition',
            'placeholder:text-slate-300 focus:bg-white',
            weightValid
              ? 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
              : weight.length > 0
                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100',
          ].join(' ')}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
          кг
        </span>
      </div>

      {weight.length > 0 && !weightValid && (
        <p className="mt-2 text-sm text-red-500">Введите корректный вес (от 0.5 до 250 кг)</p>
      )}

      {/* Quick presets */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[5, 10, 15, 20, 30].map((w) => (
          <button
            key={w}
            onClick={() => setWeight(String(w))}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-sky-100 hover:text-sky-700"
          >
            {w} кг
          </button>
        ))}
      </div>

      {weightValid && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Вес принят: <strong className="font-semibold">{round(weightNumHelper(weight))} кг</strong>
        </div>
      )}
    </div>
  );
}

function weightNumHelper(w: string): number {
  return parseFloat(w.replace(',', '.'));
}

/* ---------------- Step 2: Medicine ---------------- */

function StepMedicine({
  medicineId,
  setMedicineId,
  selectedMedicine,
}: {
  medicineId: string;
  setMedicineId: (v: string) => void;
  selectedMedicine: Medicine | null;
}) {
  return (
    <div className="animate-fadeIn">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
          <Pill className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Выбор лекарства</h2>
          <p className="text-sm text-slate-500">Выберите препарат из списка</p>
        </div>
      </div>

      <label htmlFor="medicine" className="mb-1.5 block text-sm font-medium text-slate-600">
        Препарат
      </label>
      <div className="relative">
        <select
          id="medicine"
          value={medicineId}
          onChange={(e) => setMedicineId(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-base font-medium text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
        >
          <option value="">— выберите лекарство —</option>
          {medicines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} {m.concentrationLabel}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          ▾
        </span>
      </div>

      {selectedMedicine && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{selectedMedicine.name}</p>
              <p className="mt-0.5 text-sm text-slate-500">
                Концентрация: {selectedMedicine.concentrationLabel}
              </p>
            </div>
            <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
              {selectedMedicine.doseRangeLabel}
            </span>
          </div>
          <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            {selectedMedicine.note}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------------- Step 3: Result ---------------- */

function StepResult({
  medicine,
  weightNum,
  result,
}: {
  medicine: Medicine;
  weightNum: number;
  result: DoseResult;
}) {
  const { isOverLimit, safetyLevel, safetyPct } = result;

  return (
    <div className="animate-fadeIn">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Результат</h2>
          <p className="text-sm text-slate-500">
            {medicine.name} · {medicine.concentrationLabel} · {round(weightNum)} кг
          </p>
        </div>
      </div>

      {/* Dose cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4">
          <div className="flex items-center gap-2 text-sky-700">
            <Pill className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Доза</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {round(result.doseMgMin)}–{round(result.doseMgMax)}
            <span className="ml-1 text-base font-medium text-slate-500">мг</span>
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            на 1 приём · {medicine.doseRangeLabel}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Syringe className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Объём сиропа</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {round(result.volumeMlMin)}–{round(result.volumeMlMax)}
            <span className="ml-1 text-base font-medium text-slate-500">мл</span>
          </p>
          <p className="mt-0.5 text-sm text-slate-500">набрать в шприц</p>
        </div>
      </div>

      {/* Daily total */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-500">Суточная доза</span>
        <span className="text-sm font-semibold text-slate-700">
          {round(result.dailyTotalMin)}–{round(result.dailyTotalMax)} мг/сут
          <span className="ml-2 text-slate-400">· {medicine.dosesPerDay} приёма</span>
        </span>
      </div>

      {/* Safety scale */}
      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck
            className={[
              'h-4 w-4',
              safetyLevel === 'over' ? 'text-red-500' : safetyLevel === 'caution' ? 'text-amber-500' : 'text-emerald-500',
            ].join(' ')}
          />
          <span className="text-sm font-semibold text-slate-700">Шкала безопасности</span>
        </div>

        <SafetyBar level={safetyLevel} pct={safetyPct} />

        <div className="mt-2 flex justify-between text-[11px] text-slate-400">
          <span>Безопасно</span>
          <span>Максимум</span>
          <span>Превышение</span>
        </div>
      </div>

      {/* Warning or OK */}
      {isOverLimit ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">Превышение максимальной суточной дозы!</p>
            <p className="mt-0.5 text-sm text-red-600">
              Максимально допустимо {round(medicine.maxDailyPerKg * weightNum)} мг/сут.
              Рассчитанная доза ({round(result.dailyTotalMax)} мг/сут) превышает лимит.
              Снизьте разовую дозу или количество приёмов.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-sm text-emerald-700">
            Доза в пределах безопасного диапазона для веса {round(weightNum)} кг.
          </p>
        </div>
      )}

      {/* Syringe illustration */}
      <SyringeVisual volumeMin={result.volumeMlMin} volumeMax={result.volumeMlMax} />

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
        <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400" />
        Расчёт основан на стандартных педиатрических диапазонах. Концентрация: {medicine.concentration} мг/мл.
      </div>
    </div>
  );
}

function SafetyBar({
  level,
  pct,
}: {
  level: 'safe' | 'caution' | 'over';
  pct: number;
}) {
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-red-400">
      <div
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-slate-800 shadow-md transition-all duration-500"
        style={{ left: `calc(${Math.min(100, pct)}% - 10px)` }}
      />
    </div>
  );
}

function SyringeVisual({ volumeMin, volumeMax }: { volumeMin: number; volumeMax: number }) {
  const maxMark = Math.max(5, Math.ceil(volumeMax));
  const fillPct = Math.min(100, (volumeMax / maxMark) * 100);

  return (
    <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
        <Activity className="h-4 w-4 text-sky-500" /> Визуализация шприца
      </p>
      <div className="flex items-end gap-1">
        {/* barrel */}
        <div className="relative h-12 flex-1 rounded-md border border-slate-200 bg-white">
          <div
            className="absolute bottom-0 left-0 h-full rounded-md bg-gradient-to-t from-sky-400 to-sky-300 transition-all duration-500"
            style={{ width: `${fillPct}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-700 mix-blend-luminosity">
              {round(volumeMin)}–{round(volumeMax)} мл
            </span>
          </div>
        </div>
        {/* tip */}
        <div className="h-3 w-2 bg-slate-300" />
        {/* plunger */}
        <div className="h-6 w-3 rounded-sm bg-slate-400" />
        <div className="h-8 w-1 bg-slate-300" />
      </div>
      <p className="mt-1.5 text-center text-xs text-slate-400">
        Шкала до {maxMark} мл · рекомендуемый диапазон выделен
      </p>
    </div>
  );
}

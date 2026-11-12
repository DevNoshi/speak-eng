#!/usr/bin/env python3
"""Gera os MP3 do Speak Daily com vozes neurais (inglês americano).

Uso (na raiz do projeto):
    pip install edge-tts
    python tools/gerar-audio.py

Cria:
    audio/<frase>.mp3        velocidade normal
    audio/slow/<frase>.mp3   velocidade lenta (botão "Voz devagar")

Só gera o que ainda não existe, então pode rodar de novo depois de
adicionar frases em js/data.js ou js/extra.js. Use --force para refazer tudo.
"""
import asyncio
import re
import sys
from pathlib import Path

import edge_tts

RAIZ = Path(__file__).resolve().parent.parent
VOZ_PADRAO = "en-US-JennyNeural"   # palavras, números e frases soltas
VOZ_A = "en-US-JennyNeural"        # pessoa A nas conversas
VOZ_B = "en-US-GuyNeural"          # pessoa B nas conversas
VELOCIDADE_LENTA = "-30%"
SIMULTANEOS = 4

STR = r'"((?:[^"\\]|\\.)*)"'
PAR = re.compile(r"\[" + STR + "," + STR + r"(?:," + STR + r")?\]")


def slug(texto: str) -> str:
    """Mesma regra de js/audio.js — não altere um sem o outro."""
    t = texto.lower().replace("\u2018", "'").replace("\u2019", "'")
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def frases():
    """Lê js/data.js e js/extra.js. Retorna {slug: (texto_em_ingles, voz)}."""
    saida = {}
    for nome in ("data.js", "extra.js"):
        codigo = (RAIZ / "js" / nome).read_text(encoding="utf-8")
        for a, b, c in PAR.findall(codigo):
            if c:  # conversa: ["A", "inglês", "português"]
                texto, voz = b, (VOZ_A if a == "A" else VOZ_B)
            else:  # lição: ["inglês", "português"]
                texto, voz = a, VOZ_PADRAO
            texto = texto.encode().decode("unicode_escape") if "\\" in texto else texto
            saida.setdefault(slug(texto), (texto, voz))
    return saida


async def gerar(sem, texto, voz, destino, rate):
    async with sem:
        destino.parent.mkdir(parents=True, exist_ok=True)
        falado = texto.replace("\u2019", "'").replace("\u2018", "'")
        for tentativa in range(3):
            try:
                await edge_tts.Communicate(falado, voz, rate=rate).save(str(destino))
                print("ok  ", destino.relative_to(RAIZ))
                return True
            except Exception as erro:  # rede instável: tenta de novo
                if tentativa == 2:
                    print("ERRO", destino.name, erro)
                    return False
                await asyncio.sleep(2)


async def main():
    refazer = "--force" in sys.argv
    lista = frases()
    sem = asyncio.Semaphore(SIMULTANEOS)
    tarefas = []
    for nome, (texto, voz) in lista.items():
        for pasta, rate in (("audio", "+0%"), ("audio/slow", VELOCIDADE_LENTA)):
            destino = RAIZ / pasta / f"{nome}.mp3"
            if refazer or not destino.exists():
                tarefas.append(gerar(sem, texto, voz, destino, rate))
    print(f"{len(lista)} frases · {len(tarefas)} arquivos a gerar")
    resultado = await asyncio.gather(*tarefas)
    falhas = resultado.count(False)
    print(f"Pronto. Falhas: {falhas}")
    sys.exit(1 if falhas else 0)


if __name__ == "__main__":
    asyncio.run(main())

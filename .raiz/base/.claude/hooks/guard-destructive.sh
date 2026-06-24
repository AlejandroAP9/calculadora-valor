#!/bin/bash
# PreToolUse(Bash) guard de Raíz: avisa ante comandos potencialmente destructivos.
# Es un RECORDATORIO (additionalContext), no un bloqueo duro, para no romper trabajo
# legitimo en un template generico. Si quieres que bloquee de verdad en un proyecto,
# cambia la salida a permissionDecision:"deny".
CMD=$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('tool_input',d).get('command',''))" 2>/dev/null || true)

case "$CMD" in
  *"rm -rf"*|*"rm -fr"*|*"git push --force"*|*"push -f "*|*"checkout HEAD --"*|*"reset --hard"*|*"DROP TABLE"*|*"DROP DATABASE"*|*"TRUNCATE "*)
    echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"GUARD: comando potencialmente destructivo (rm -rf / force-push / checkout HEAD -- / reset --hard / DROP / TRUNCATE). Confirma que es intencional y que no borras trabajo sin commitear ni datos antes de ejecutar."}}'
    ;;
  *)
    echo '{}'
    ;;
esac
